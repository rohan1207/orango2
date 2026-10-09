"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import LiveBlobs from "./LiveBlobs";

const GREEN = "#1F6B3A";
const ORANGE = "#EE6F28";

const features = [
  {
    title: "Oranges stored at 4°C",
    copy: "Fresh oranges and naturally chilled juice",
    icon: ThermometerIcon,
  },
  {
    title: "UPI enabled payments",
    copy: "Seamless experience",
    icon: QrPayIcon,
  },
  {
    title: "Scheduled self-cleaning",
    copy: "Regular cleaning intervals.",
    icon: CleanIcon,
  },
  {
    title: "Ozone sterilization",
    copy: "Enhanced hygiene.",
    icon: ShieldIcon,
  },
  {
    title: "Sealed for maximum benefits",
    copy: "Preserves nutrients and freshness",
    icon: LockIcon,
  },
  {
    title: "Daily tracking",
    copy: "For regular replenishment.",
    icon: ChartIcon,
  },
];

function ThermometerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M10 14.5V5.5a2 2 0 1 1 4 0v9a3.5 3.5 0 1 1-4 0Z"
        stroke={ORANGE}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5.5v8.2"
        stroke={ORANGE}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1.6" fill={ORANGE} />
      <path
        d="M15.8 4.2h2.4M15.8 7h2.4M15.8 9.8h1.6"
        stroke={ORANGE}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function QrPayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" stroke={ORANGE} strokeWidth="1.7" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" stroke={ORANGE} strokeWidth="1.7" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" stroke={ORANGE} strokeWidth="1.7" />
      <path
        d="M14 14h2.5v2.5H14V14Zm4 0H20v2h-2v-2Zm-4 4h2v2.5h-2V18Zm4 1.5H20V22h-2.5v-2.5H16V18h2v1.5Z"
        fill={ORANGE}
      />
      <rect x="5.5" y="5.5" width="3" height="3" rx="0.4" fill={ORANGE} />
      <rect x="15.5" y="5.5" width="3" height="3" rx="0.4" fill={ORANGE} />
      <rect x="5.5" y="15.5" width="3" height="3" rx="0.4" fill={ORANGE} />
    </svg>
  );
}

function CleanIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M8 4h8l-1 4H9L8 4Z"
        stroke={ORANGE}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 8h6v2.5c0 1.2-.6 2.3-1.6 3L12 15l-1.4-1.5c-1-.7-1.6-1.8-1.6-3V8Z"
        stroke={ORANGE}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M10 15.5 9 21M14 15.5l1 5.5M12 15.5V21"
        stroke={ORANGE}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M12 3.5 19 6.5v5.2c0 4.3-2.9 7.4-7 8.8-4.1-1.4-7-4.5-7-8.8V6.5L12 3.5Z"
        stroke={ORANGE}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12.2 11.2 14l3.5-4"
        stroke={ORANGE}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect
        x="6"
        y="10.5"
        width="12"
        height="9.5"
        rx="2"
        stroke={ORANGE}
        strokeWidth="1.8"
      />
      <path
        d="M9 10.5V8a3 3 0 0 1 6 0v2.5"
        stroke={ORANGE}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15" r="1.3" fill={ORANGE} />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M4 17.5 9 12l3.5 3.5L20 7"
        stroke={ORANGE}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="12" r="1.6" fill={ORANGE} />
      <circle cx="12.5" cy="15.5" r="1.6" fill={ORANGE} />
      <circle cx="20" cy="7" r="1.6" fill={ORANGE} />
    </svg>
  );
}

export default function SmartTech() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="tech-heading"
      className="relative overflow-hidden bg-[#FFFAF6] py-12 sm:py-16 lg:flex lg:h-[calc(100dvh-var(--nav-h))] lg:items-stretch lg:py-0"
    >
      <LiveBlobs
        items={[
          {
            className: "left-[-8%] top-[6%] h-48 w-48 md:h-56 md:w-56",
            opacity: 0.14,
            delay: 0,
            rotate: [0, 10, -6, 0],
          },
          {
            className: "right-[-6%] bottom-[8%] h-44 w-44 md:h-52 md:w-52",
            opacity: 0.12,
            delay: 0.7,
            rotate: [0, -8, 10, 0],
          },
        ]}
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col px-5 py-0 lg:px-8 lg:py-6 xl:py-8">
        <div className="grid h-full min-h-0 flex-1 items-stretch gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:gap-14">
          {/* Left image */}
          <div className="relative order-2 flex h-[min(58vw,360px)] min-h-[260px] items-center justify-center sm:h-[380px] lg:order-1 lg:h-full lg:min-h-0">
            <div className="pointer-events-none absolute inset-[12%] rounded-[2rem] bg-[#EE6F28]/8" />
            <motion.div
              animate={reduce ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-[1] flex h-full w-full items-center justify-center p-1 sm:p-2"
            >
              <Image
                src="/internal.png"
                alt="Inside the OranGo machine"
                width={900}
                height={1100}
                sizes="(max-width: 1024px) 70vw, 42vw"
                className="h-full w-auto max-w-full rounded-3xl object-contain drop-shadow-[0_24px_48px_rgba(238,111,40,0.18)]"
              />
            </motion.div>
          </div>

          {/* Right content — client card grid */}
          <div className="order-1 flex min-h-0 flex-col justify-center lg:order-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#EE6F28]">
              Inside the machine
            </p>
            <h2
              id="tech-heading"
              className="mt-2 text-[clamp(1.6rem,4vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[#8B3410] lg:mt-2.5"
            >
              Built clean. Built for busy floors.
            </h2>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[#8B3410]/65 sm:text-[15px] lg:mt-3.5">
              Cold storage, UPI, ozone cleaning and sealed cups — so guests trust
              the juice and hosts trust the machine.
            </p>

            <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-3.5 lg:mt-5 xl:mt-6">
              {features.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-2xl bg-white p-4 shadow-[0_1px_0_rgba(139,52,16,0.04)] sm:p-[1.1rem] lg:p-4 xl:p-[1.15rem]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF3E0]">
                      <Icon />
                    </span>
                    <h3
                      className="mt-3 text-[0.95rem] font-semibold leading-snug tracking-[-0.02em] sm:text-[1rem]"
                      style={{ color: GREEN }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-[#5C6370] sm:text-[13px]">
                      {item.copy}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
