/**
 * Compress scroll frames → public/frames/compressed
 * Target: ≤ maxKb per file, keep visual quality (binary-search JPEG q).
 * Originals in public/frames/frames are never modified.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public/frames");
const SRC = path.join(ROOT, "frames");
const DEST = path.join(ROOT, "compressed");
const MAX_BYTES = 200 * 1024;
const BG = { r: 255, g: 250, b: 246 }; // #FFFAF6
const MIN_Q = 55;
const MAX_Q = 92;

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function encodeAt(inputBuf, quality, width) {
  let pipeline = sharp(inputBuf, { failOn: "none" }).rotate();
  if (width) {
    pipeline = pipeline.resize({
      width,
      height: width,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  return pipeline
    .flatten({ background: BG })
    .jpeg({ quality, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

async function compressOne(srcPath, destPath) {
  const inputBuf = await fs.readFile(srcPath);
  const meta = await sharp(inputBuf, { failOn: "none" }).metadata();
  const baseW = meta.width || 1920;

  // Try full width first, then gentle downscale if still over budget at MIN_Q
  const widths = [null, Math.min(baseW, 1600), Math.min(baseW, 1440), Math.min(baseW, 1280)];

  let best = null;
  for (const w of widths) {
    // Quick check at MIN_Q for this width
    const probe = await encodeAt(inputBuf, MIN_Q, w);
    if (probe.length > MAX_BYTES) continue;

    let lo = MIN_Q;
    let hi = MAX_Q;
    let chosen = probe;
    let chosenQ = MIN_Q;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const buf = await encodeAt(inputBuf, mid, w);
      if (buf.length <= MAX_BYTES) {
        chosen = buf;
        chosenQ = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    best = { buf: chosen, q: chosenQ, w: w || baseW };
    break; // prefer largest width that fits
  }

  if (!best) {
    // Last resort: force smaller until it fits
    let w = 1100;
    let buf;
    do {
      buf = await encodeAt(inputBuf, MIN_Q, w);
      if (buf.length <= MAX_BYTES) {
        best = { buf, q: MIN_Q, w };
        break;
      }
      w -= 80;
    } while (w >= 640);
    if (!best) best = { buf, q: MIN_Q, w: Math.max(w, 640) };
  }

  const outName = path.basename(srcPath).replace(/\.png$/i, ".jpg");
  const outPath = path.join(path.dirname(destPath), outName);
  await fs.writeFile(outPath, best.buf);
  return {
    name: outName,
    kb: +(best.buf.length / 1024).toFixed(1),
    q: best.q,
    w: best.w,
  };
}

async function main() {
  await ensureDir(DEST);
  const files = (await fs.readdir(SRC))
    .filter((f) => /^ezgif-frame-\d+\.png$/i.test(f))
    .sort();

  if (!files.length) {
    console.error("No ezgif-frame-*.png found in", SRC);
    process.exit(1);
  }

  console.log(`Compressing ${files.length} frames → ${DEST}`);
  console.log(`Max size: ${MAX_BYTES / 1024} KB (JPEG, quality preserved as much as possible)\n`);

  let over = 0;
  let totalIn = 0;
  let totalOut = 0;

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const srcPath = path.join(SRC, f);
    const st = await fs.stat(srcPath);
    totalIn += st.size;

    const result = await compressOne(srcPath, path.join(DEST, f));
    totalOut += result.kb * 1024;
    if (result.kb > 200) over += 1;

    if ((i + 1) % 10 === 0 || i === 0 || i === files.length - 1) {
      console.log(
        `[${String(i + 1).padStart(3)}/${files.length}] ${result.name}  ${result.kb} KB  q=${result.q}  w=${result.w}`,
      );
    }
  }

  console.log("\nDone.");
  console.log(`Input:  ${(totalIn / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Output: ${(totalOut / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Over 200KB: ${over}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
