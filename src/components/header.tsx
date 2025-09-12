"use client";

import React from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

import { cn } from "@/lib/utils";

export const Header = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const [isActive, setIsActive] = React.useState(false);

  useMotionValueEvent(scrollY, "change", latest => {
    setIsActive(latest > 88);
  });

  return (
    <motion.header
      animate={{ width: isActive ? 138 : 98 }}
      transition={{ type: "spring", duration: 0.5 }}
      className={cn(
        "fixed left-1/2 top-6 z-404 flex h-10 -translate-x-1/2 items-center justify-between gap-4 rounded-full px-2 text-neutral-50 shadow-md border border-white/10 backdrop-blur-xl bg-background/5",
      )}>
      <Link href="/" className="overflow-hidden">
        <svg className="pointer-events-none h-5 w-20 fill-neutral-50">
          <text
            x={2}
            y={17}
            className={cn("stroke-2 text-xl font-black")}
            paintOrder="stroke fill">
            anshori
            <tspan className="fill-red-500 stroke-none">.</tspan>
          </text>
        </svg>
      </Link>

      <AnimatePresence>
        {isActive && (
          <svg
            viewBox="0 0 100 100"
            className="size-6 -rotate-90 [&_circle]:fill-none [&_circle]:stroke-[16]">
            <circle
              cx="50"
              cy="50"
              r="40"
              pathLength="1"
              className="stroke-neutral-700"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-neutral-50"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
