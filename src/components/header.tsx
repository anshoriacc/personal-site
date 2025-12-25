"use client";

import React from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const [isActive, setIsActive] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [view, setView] = React.useState("idle");
  const [variantKey, setVariantKey] = React.useState("initial");
  const isMobile = useIsMobile();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsActive(latest > 88);
  });

  return (
    <MotionConfig transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}>
      <div className="pointer-events-none fixed top-6 left-0 z-404 flex w-full">
        <motion.header
          layout
          onHoverStart={() => !isMobile && setIsHovered(true)}
          onHoverEnd={() => !isMobile && setIsHovered(false)}
          onClick={(e) => {
            if (isMobile && e.target === e.currentTarget) {
              setIsHovered(!isHovered);
            }
          }}
          style={{ borderRadius: 24 }}
          className={cn(
            "pointer-events-auto  mx-auto flex min-h-10 w-fit gap-4 bg-neutral-500/50 p-2.5 text-neutral-50 shadow-md backdrop-blur-md"
          )}
        >
          <motion.div
            // initial={{
            //   opacity: 0,
            //   filter: "blur(3px)",
            // }}
            initial={false}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
            }}
            key={isHovered ? "expanded" : "collapsed"}
          >
            {!isHovered ? (
              <motion.div layoutId="logo">
                <svg className="pointer-events-auto h-5 w-20 fill-neutral-50">
                  <text
                    x={2}
                    y={17}
                    className={cn("stroke-2 text-xl font-black")}
                    paintOrder="stroke fill"
                  >
                    anshori
                    <tspan className="fill-red-500 stroke-none">.</tspan>
                  </text>
                </svg>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-2.5 size-50">
                <div className="flex h-5 items-center justify-between gap-4">
                  <motion.div layoutId="logo">
                    <Link
                      href="/"
                      className="flex items-center overflow-hidden"
                    >
                      <svg className="pointer-events-none h-5 w-20 fill-neutral-50">
                        <text
                          x={2}
                          y={17}
                          className={cn("stroke-2 text-xl font-black")}
                          paintOrder="stroke fill"
                        >
                          anshori
                          <tspan className="fill-red-500 stroke-none">.</tspan>
                        </text>
                      </svg>
                    </Link>
                  </motion.div>

                  <ThemeToggle />
                </div>

                <div className="h-px w-full rounded-full bg-white/10" />
              </div>
            )}
          </motion.div>
        </motion.header>
      </div>
    </MotionConfig>
  );
};
