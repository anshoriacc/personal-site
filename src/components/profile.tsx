import React from "react";
import { Card } from "./ui/card-home";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "./ui/background-beams";

export const Profile = () => {
  return (
    <Card className="h-48 w-full gap-1 sm:w-[calc(100%-216px)]">
      <div className="z-1 flex flex-col">
        <h1 className="text-xl font-bold">Achmad Anshori</h1>
        <h2>
          <span className="text-lg font-semibold text-neutral-500">
            Software Engineer, Frontend
          </span>
        </h2>
      </div>

      <div className="z-1 h-[1px] bg-neutral-800" />

      <p
        className={cn(
          "z-1 text-neutral-500",
          "[&_span:hover]:text-neutral-50 [&_span:hover]:transition-all [&_span:hover]:duration-300",
        )}>
        a <span>software engineer</span> with{" "}
        <span>3 years of hands on experience</span>. Interested in{" "}
        <span>react</span>, <span>next.js</span>, and <span>node.js</span>.
      </p>

      <BackgroundBeams className="z-0" />
    </Card>
  );
};
