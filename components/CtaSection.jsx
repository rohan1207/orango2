"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import LiveBlobs from "./LiveBlobs";
import OrangeSliceDecor from "./OrangeSliceDecor";

const blocks = [
  {
    id: "location",
    kicker: "For venues",
    title: "Bring OranGo to your location",
    copy: "You provide the space (~12sqft) and an electrical connection. We take care of the rest.",
    cta: "Request a site survey",
    href: "/contact?intent=survey#site-survey",
    primary: true,
  },
  {
    id: "business",
    kicker: "For entrepreneurs",
    title: "Build a business with OranGo",
    copy: "From young individual entrepreneurs looking to start small to groups looking for larger scale projects, OranGo offers opportunities to own and grow a business.",
    cta: "Explore business opportunities",
    href: "/business-opportunity",
    primary: false,
  },
];

export default function CtaSection() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="operators-heading"
      className="relative overflow-hidden bg-white py-14 sm:py-20 md:py-24"
    >
      <LiveBlobs />
      <OrangeSliceDecor
        className="right-[-5%] top-[8%] h-44 w-44 md:h-52 md:w-52"
        opacity={0.14}
        rotate={16}
      />
      <OrangeSliceDecor
        className="bottom-[-6%] left-[-4%] h-40 w-40 md:h-48 md:w-48"
        opacity={0.12}
        rotate={-12}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 md:px-8">
        <h2 id="operators-heading" className="sr-only">
          Bring OranGo to your location or build a business with OranGo
        </h2>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
          {blocks.map((block, i) => (
            <motion.article
              key={block.id}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className={`relative flex flex-col overflow-hidden rounded-[1.6rem] p-7 sm:rounded-[1.85rem] sm:p-8 md:p-9 ${
                block.primary
                  ? "bg-[#EE6F28] text-white"
                  : "border border-[#8B3410]/10 bg-[#FFFAF6] text-[#8B3410]"
              }`}
            >
              {block.primary ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(145deg, #FF9A4A 0%, #F07A32 48%, #EE6F28 100%)",
                  }}
                />
              ) : null}

              <div className="relative z-[1] flex h-full flex-col">
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.2em] sm:text-[12px] ${
                    block.primary ? "text-[#FFE0B8]" : "text-[#EE6F28]"
                  }`}
                >
                  {block.kicker}
                </p>
                <h3 className="mt-3 text-[clamp(1.45rem,2.8vw,2.05rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
                  {block.title}
                </h3>
                <p
                  className={`mt-4 flex-1 text-[15px] leading-relaxed sm:text-[16px] ${
                    block.primary ? "text-white/88" : "text-[#8B3410]/70"
                  }`}
                >
                  {block.copy}
                </p>
                <div className="mt-8">
                  <Link
                    href={block.href}
                    className={`inline-flex w-full items-center justify-center rounded-full px-7 py-3.5 text-[14px] font-semibold transition-colors sm:w-auto sm:text-[15px] ${
                      block.primary
                        ? "bg-white text-[#8B3410] hover:bg-[#FFF5ED]"
                        : "bg-[#EE6F28] text-white hover:bg-[#d45a18]"
                    }`}
                  >
                    {block.cta}
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
