import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Card } from "./ui/card-home";
import cvImage from "@/assets/cv-img.png";

export const Resume = () => {
  return (
    <Link
      href="https://resume.anshori.com/"
      target="_blank"
      className="group aspect-square w-[calc(50%-12px)] sm:w-48"
      title="go to my resume page"
    >
      <Card type="link" className="size-full items-center justify-center">
        <Image
          src={cvImage}
          width={256}
          height={256}
          alt="Resume"
          className={cn(
            "pointer-events-none max-w-none absolute size-64 top-1/3 grayscale transition-all duration-500",
            "group-hover:-translate-y-1/5 group-hover:scale-80",
          )}
        />

        <span className="absolute top-4 text-sm font-bold text-neutral-500 uppercase transition-all duration-300 group-hover:text-inherit">
          RESUME
        </span>
      </Card>
    </Link>
  );
};
