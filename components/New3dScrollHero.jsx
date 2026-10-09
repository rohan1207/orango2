"use client";

/**
 * Scroll-scrubbed frame hero — Drip-style smoothness with hard pin:
 * - Wait for ALL frames before unlocking page scroll
 * - GSAP pin + scrub so fast scroll cannot skip past the sequence
 * - rAF FRAME_LERP = 0.13 for silky frame glide
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "./Preloader";
import {
  DEFAULT_FRAME_SET,
  MOBILE_BREAKPOINT,
  drawFrame,
  folderFromWidth,
  getFrameSet,
  nearestLoaded,
  preloadFrames,
} from "@/lib/frames";

gsap.registerPlugin(ScrollTrigger);

/** ScrollTrigger: seconds for playhead to ease toward scroll */
const SCROLL_SCRUB_SMOOTH_SEC = 0.55;
/** rAF lerp toward fractional frame target; lower = silkier */
const FRAME_LERP = 0.13;
/** Viewport-heights of pin distance per ~25 frames (300 → ~12 screens) */
const VH_PER_25_FRAMES = 1;

function pinScrollDistance(frameCount) {
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const screens = Math.max(10, Math.ceil(frameCount / 25) * VH_PER_25_FRAMES);
  return Math.round(vh * screens);
}

export default function New3dScrollHero({
  frameSet = DEFAULT_FRAME_SET,
  /** When true, wait until 100% frames. Default follows set.requireAll. */
  waitForAllFrames,
  /** Landing already warmed frames — no second full-screen preloader */
  skipPreloader = false,
}) {
  const set = getFrameSet(frameSet);
  const totalFrames = set.total;
  const waitForAll =
    waitForAllFrames != null
      ? Boolean(waitForAllFrames)
      : Boolean(set.requireAll);

  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const framesRef = useRef([]);
  const sessionRef = useRef(null);
  const folderRef = useRef(set.desktop);
  const unsubRef = useRef(null);
  const targetRef = useRef(0);
  const displayedRef = useRef(0);
  const sizeRef = useRef({ w: 1, h: 1 });
  const lastPaintedRef = useRef(-1);
  const modeRef = useRef("cover");
  const unlockedRef = useRef(false);
  const isMobileRef = useRef(false);
  const totalRef = useRef(totalFrames);
  const setIdRef = useRef(frameSet);
  const waitAllRef = useRef(waitForAll);
  const skipPreloaderRef = useRef(skipPreloader);

  const [loadRatio, setLoadRatio] = useState(0);
  const [ready, setReady] = useState(false);
  const [loaderGone, setLoaderGone] = useState(skipPreloader);

  totalRef.current = totalFrames;
  setIdRef.current = frameSet;
  waitAllRef.current = waitForAll;
  skipPreloaderRef.current = skipPreloader;

  const unlock = (instant = false) => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    setReady(true);
    if (instant || skipPreloaderRef.current) {
      setLoaderGone(true);
    } else {
      window.setTimeout(() => setLoaderGone(true), 420);
    }
  };

  const canUnlock = (session) => {
    if (!session) return false;
    const total = session.total || totalRef.current;
    const loaded = session.loaded || 0;
    // Always require every frame before traditional page scroll
    if (waitAllRef.current || set.requireAll) {
      return loaded >= total && Boolean(session.frames?.[0]);
    }
    const entry = session.readyRatio ?? set.readyRatio ?? 1;
    return (
      Boolean(session.frames?.[0]) &&
      loaded >= Math.ceil(total * entry)
    );
  };

  const bindSession = (folder) => {
    folderRef.current = folder;
    const session = preloadFrames(folder, { aggressive: true });
    sessionRef.current = session;
    framesRef.current = session.frames;
    if (session.total) totalRef.current = session.total;
    if (unsubRef.current) unsubRef.current();

    unsubRef.current = session.subscribe(({ ratio }) => {
      if (session.total) totalRef.current = session.total;
      setLoadRatio(ratio);
      if (canUnlock(session)) unlock(skipPreloaderRef.current);
    });

    if (canUnlock(session)) unlock(true);
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    try {
      window.history.scrollRestoration = "manual";
    } catch {
      /* ignore */
    }
    window.scrollTo(0, 0);
    isMobileRef.current = window.innerWidth < MOBILE_BREAKPOINT;
    unlockedRef.current = false;
    setReady(false);
    setLoaderGone(skipPreloader);
    setLoadRatio(0);
    targetRef.current = 0;
    displayedRef.current = 0;
    lastPaintedRef.current = -1;
    bindSession(folderFromWidth(window.innerWidth, frameSet));

    // Only bail if nearly complete — never unlock a half-loaded sequence
    const failSafe = window.setTimeout(() => {
      const session = sessionRef.current;
      if (
        session &&
        session.loaded >= session.total &&
        session.frames?.[0]
      ) {
        unlock(skipPreloaderRef.current);
      }
    }, 120000);

    return () => {
      window.clearTimeout(failSafe);
      if (unsubRef.current) unsubRef.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameSet, waitForAll, skipPreloader]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const html = document.documentElement;
    if (!ready) {
      html.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      html.style.overflow = "";
    }
    return () => {
      html.style.overflow = "";
    };
  }, [ready]);

  const sizeCanvas = () => {
    try {
      const canvas = canvasRef.current;
      const stage = stageRef.current;
      if (!canvas || !stage || !canvas.isConnected) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, stage.clientWidth || window.innerWidth);
      const h = Math.max(1, stage.clientHeight || window.innerHeight);
      sizeRef.current = { w, h };
      isMobileRef.current = w < MOBILE_BREAKPOINT;
      modeRef.current = isMobileRef.current ? "contain" : "cover";
      const tw = Math.round(w * dpr);
      const th = Math.round(h * dpr);
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw;
        canvas.height = th;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        const ctx = canvas.getContext("2d", {
          alpha: false,
          desynchronized: true,
        });
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctxRef.current = ctx;
        }
      }
    } catch {
      /* never crash scroll path */
    }
  };

  const paint = (frameIndex) => {
    try {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas?.isConnected || !ctx) return;
      const { w, h } = sizeRef.current;
      if (w < 2 || h < 2) return;
      const img = nearestLoaded(framesRef.current, frameIndex);
      drawFrame(ctx, img, w, h, modeRef.current);
      lastPaintedRef.current = Math.round(frameIndex);
    } catch {
      /* swallow */
    }
  };

  useLayoutEffect(() => {
    if (!ready) return;
    sizeCanvas();
    paint(displayedRef.current);
  }, [ready]);

  // rAF lerp — Drip FRAME_LERP = 0.13
  useEffect(() => {
    if (!ready) return undefined;
    let raf = 0;
    let alive = true;
    let boostTick = 0;

    const tick = () => {
      if (!alive) return;
      try {
        const lastFrame = Math.max(0, (totalRef.current || 1) - 1);
        const target = Math.min(Math.max(0, targetRef.current), lastFrame);
        const current = displayedRef.current;
        const next = current + (target - current) * FRAME_LERP;
        const snapped = Math.abs(next - target) < 0.04 ? target : next;
        displayedRef.current = snapped;

        const displayFrame = Math.min(Math.round(snapped), lastFrame);
        if (displayFrame !== lastPaintedRef.current) {
          paint(displayFrame);
        }

        boostTick += 1;
        if (boostTick % 6 === 0) {
          sessionRef.current?.boostAround?.(snapped, 40);
        }
      } catch {
        /* ignore */
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [ready]);

  /**
   * Pin the viewport-sized stage for a long scroll runway.
   * Fast wheel/trackpad only advances pin progress — cannot jump to sections below
   * until the full sequence distance is consumed (same idea as Drip's tall runway).
   */
  useLayoutEffect(() => {
    if (!ready || !stageRef.current || !trackRef.current) return undefined;

    const stage = stageRef.current;
    let st = null;

    const attach = () => {
      if (st) st.kill();
      const lastFrame = Math.max(0, (totalRef.current || 1) - 1);
      const frames = totalRef.current || 1;

      st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${pinScrollDistance(frames)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: SCROLL_SCRUB_SMOOTH_SEC,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetRef.current = self.progress * lastFrame;
        },
      });

      targetRef.current = 0;
      displayedRef.current = 0;
      lastPaintedRef.current = -1;
      sizeCanvas();
      paint(0);
      ScrollTrigger.refresh();
    };

    const bootOuter = requestAnimationFrame(() => {
      requestAnimationFrame(attach);
    });

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        try {
          const nextFolder = folderFromWidth(
            window.innerWidth,
            setIdRef.current,
          );
          if (nextFolder !== folderRef.current) {
            bindSession(nextFolder);
          }
          sizeCanvas();
          lastPaintedRef.current = -1;
          paint(Math.round(displayedRef.current));
          ScrollTrigger.refresh();
        } catch {
          /* ignore */
        }
      }, 160);
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.visualViewport?.addEventListener("resize", onResize, {
      passive: true,
    });

    const onPageShow = (e) => {
      if (e.persisted) attach();
      ScrollTrigger.refresh();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelAnimationFrame(bootOuter);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("pageshow", onPageShow);
      window.clearTimeout(resizeTimer);
      if (st) st.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <>
      {!skipPreloader && !loaderGone ? (
        <Preloader
          progress={loadRatio}
          ready={ready}
          message="Loading all frames for a smooth scroll…"
        />
      ) : null}

      <section
        ref={trackRef}
        className="hero-frame-track relative w-full bg-[#FFFAF6]"
        aria-label="OranGo product sequence"
      >
        <div
          ref={stageRef}
          id="home-scroll-hero"
          className="relative h-dvh w-full overflow-hidden bg-[#FFFAF6]"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full touch-pan-y"
            aria-hidden
          />
        </div>
      </section>
    </>
  );
}
