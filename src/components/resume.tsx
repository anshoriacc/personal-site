import { cn } from "@/lib/utils";
import { Card } from "./ui/card-home";
import Link from "next/link";

export const Resume = () => {
  return (
    <Link
      href="https://cv.anshori.com/"
      target="_blank"
      className="group aspect-square w-[calc(50%-12px)] sm:w-48">
      <Card type="link" className="size-full items-center justify-center">
        <span
          className={cn(
            "pointer-events-none absolute top-1/6 text-[216px] grayscale transition-all duration-500",
            "group-hover:-translate-y-1/6 group-hover:scale-80",
          )}>
          🗒️
        </span>

        <span className="uppercase absolute text-sm top-4 font-bold text-neutral-500 transition-all duration-300 group-hover:text-inherit">
          RESUME
        </span>
      </Card>
    </Link>
  );
};
