"use client";

import { useEffect, useRef, useState } from "react";
import { useOnScreen } from "./use-on-screen";

type StatItem = {
  label: string;
  value: number;
  suffix?: string;
};

interface StatsSectionProps {
  stats: StatItem[];
  containerClassName?: string;
  wrapperClassName?: string;
  numberClassName?: string;
  labelClassName?: string;
  duration?: number;
}

const DEFAULT_CONTAINER_CLASS =
  "bg-[#FAFAFA] py-12 sm:py-16 w-full min-h-[400px] sm:min-h-[316px] flex items-center group";
const DEFAULT_WRAPPER_CLASS =
  "flex flex-col md:flex-row justify-center items-center gap-16 sm:gap-20 md:gap-24 lg:gap-45 xl:gap-[211px] max-w-screen-xl mx-auto px-4";
const DEFAULT_NUMBER_CLASS =
  "text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] via-[#F51DA5] to-[#6C9AE1] text-[40px] sm:text-[50px] lg:text-[60px] font-medium font-montserrat leading-[45px] sm:leading-[50px] lg:leading-[55px] mb-2";
const DEFAULT_LABEL_CLASS =
  "text-transparent bg-clip-text bg-gradient-to-r from-[#4E4E4E] to-[#B4B4B4] text-[14px] sm:text-[16px] lg:text-[18px] font-normal font-poppins";

const StatsSection = ({
  stats,
  containerClassName = DEFAULT_CONTAINER_CLASS,
  wrapperClassName = DEFAULT_WRAPPER_CLASS,
  numberClassName = DEFAULT_NUMBER_CLASS,
  labelClassName = DEFAULT_LABEL_CLASS,
  duration = 1500,
}: StatsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(sectionRef);
  const [hasStarted, setHasStarted] = useState(false);
  const [displayValues, setDisplayValues] = useState<number[]>(
    stats.map(() => 0)
  );

  useEffect(() => {
    if (isVisible && !hasStarted) {
      setHasStarted(true);
    }
  }, [isVisible, hasStarted]);

  useEffect(() => {
    if (!hasStarted) {
      return;
    }

    let animationFrameId: number;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);

      setDisplayValues(stats.map(({ value }) => Math.round(value * progress)));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, duration, stats]);

  return (
    <div ref={sectionRef} className={containerClassName}>
      <div className={wrapperClassName}>
        {stats.map(({ label, suffix = "" }, index) => (
          <div key={label} className="text-center">
            <div className={numberClassName}>
              {displayValues[index] ?? 0}
              {suffix}
            </div>
            <div className={labelClassName}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export type { StatItem };
export default StatsSection;
