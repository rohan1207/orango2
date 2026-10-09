"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import OrangeSliceDecor from "./OrangeSliceDecor";

const GREEN = "#1F6B3A";
const ORANGE = "#EE6F28";

const steps = [
  { id: "pay", title: "Tap & Pay" },
  {
    id: "squeeze",
    title: "Watch oranges freshly squeezed in front of you",
  },
  {
    id: "enjoy",
    title: "Enjoy chilled orange juice in < 1 minute",
  },
];

/** White glyphs on solid orange circles (per mockup) */
function TapIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-[1.35rem] w-[1.35rem]" fill="none" aria-hidden>
      <circle cx="24" cy="17" r="6.5" stroke="#fff" strokeWidth="2.4" />
      <path d="M24 24.5v5.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M17.5 36c2.4-4.2 5.2-6.2 6.5-6.2s4.1 2 6.5 6.2"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 13.5c1.1-2 2.8-3.2 4-3.2"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrangeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-[1.4rem] w-[1.4rem]" fill="none" aria-hidden>
      <circle cx="24" cy="25" r="11" fill="#fff" />
      <path
        d="M24 25V15.5M24 25l6.5 6.5M24 25l-6.5 6.5M24 25h9"
        stroke={ORANGE}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="24" cy="25" r="2.4" fill={ORANGE} />
      <path
        d="M21.5 12c2.2-.9 4.8-.9 7 0"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function JuiceIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-[1.4rem] w-[1.4rem]" fill="none" aria-hidden>
      <path
        d="M17 13h14l-1.35 20.5a5 5 0 0 1-5 4.15h-1.3a5 5 0 0 1-5-4.15L17 13Z"
        fill="#fff"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M19.2 27.5c2.3 3.2 7.3 3.2 9.6 0"
        stroke={ORANGE}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M19.5 9.5h9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

const icons = {
  pay: TapIcon,
  squeeze: OrangeIcon,
  enjoy: JuiceIcon,
};

export default function ProcessSteps() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="process-heading"
      className="relative overflow-hidden bg-[#F7F4F0] py-10 md:py-12 lg:py-14"
    >
      <OrangeSliceDecor
        className="right-[-6%] top-[-4%] h-44 w-44 md:h-56 md:w-56 lg:h-64 lg:w-64"
        opacity={0.18}
        rotate={18}
      />
      <OrangeSliceDecor
        className="bottom-[-8%] left-[-5%] h-40 w-40 md:h-52 md:w-52 lg:h-56 lg:w-56"
        opacity={0.16}
        rotate={-14}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 md:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <h2
            id="process-heading"
            className="text-[clamp(1.55rem,3.1vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.03em]"
            style={{ color: GREEN }}
          >
            Fresh Orange Juice, Made Convenient
          </h2>
          <p className="mt-2 text-[15px] leading-snug text-[#8A8F98] md:text-[16px]">
            Seamless fully automated experience.
          </p>
        </header>

        {/* Main panel */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-7 overflow-hidden rounded-[28px] border border-[#E8E4DE] bg-[#F3F1ED] px-5 py-6 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] sm:rounded-[32px] sm:px-7 sm:py-7 md:mt-8 md:px-9 md:py-8 lg:px-10 lg:py-9"
        >
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-10">
            {/* Machine */}
            <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:mx-0 lg:max-w-[380px]">
              <Image
                src="/machine-process.png"
                alt="OranGo vending machine"
                width={900}
                height={1200}
                className="h-auto w-full object-contain"
                sizes="(max-width: 1024px) 70vw, 38vw"
                priority
              />
            </div>

            {/* Step cards — no connector lines */}
            <ol className="flex flex-col justify-center gap-3.5 sm:gap-4">
              {steps.map((step, index) => {
                const Icon = icons[step.id];
                return (
                  <motion.li
                    key={step.id}
                    initial={reduce ? false : { opacity: 0, x: 14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.4,
                      delay: reduce ? 0 : 0.06 * index,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center gap-3 sm:gap-3.5"
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12"
                      style={{ backgroundColor: ORANGE }}
                    >
                      <Icon />
                    </span>
                    <div className="min-w-0 flex-1 rounded-[1.75rem] border border-[#EE6F28]/50 bg-white px-5 py-3.5 sm:rounded-[2rem] sm:px-6 sm:py-4">
                      <p
                        className="text-[14px] font-semibold leading-snug tracking-[-0.015em] sm:text-[15px] md:text-[16px]"
                        style={{ color: GREEN }}
                      >
                        {step.title}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
