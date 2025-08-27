import Link from "next/link";

import { cn } from "@/lib/utils";
import { GithubIcon } from "./svg/github-icon";
import { LinkedinIcon } from "./svg/linkedin-icon";
import { MailIcon } from "./svg/mail-icon";
import { Card } from "./ui/card-home";

export const Social = () => {
  return (
    <Card
      type="link"
      className={cn(
        "h-48 w-full flex-row items-center justify-center gap-0 hover:gap-3 sm:w-[calc(100%-216px)]",
        "[&>a]:-m-4 [&>a]:flex [&>a]:aspect-square [&>a]:w-1/5 [&>a]:rotate-3 [&>a]:items-center [&>a]:justify-center [&>a]:rounded-2xl [&>a]:border-3 [&>a]:border-neutral-900 [&>a]:bg-neutral-800 [&>a]:p-4 [&>a]:transition-all [&>a]:duration-300 hover:[&>a]:m-0 hover:[&>a]:w-2/7 hover:[&>a]:rotate-0 hover:[&>a]:border-0",
        "hover:**:data-link:**:fill-neutral-500 hover:**:data-link:outline-neutral-500 has-[a:hover]:**:data-link:**:fill-neutral-50 has-[a:hover]:**:data-link:outline-neutral-50",
      )}>
      <Link href="mailto:anshoriacc@gmail.com" title="mail" className="z-3">
        <MailIcon className="size-3/4" />
      </Link>

      <Link href="/github" target="_blank" title="go to my github profile" className="z-2">
        <GithubIcon className="size-3/4" />
      </Link>

      <Link href="/linkedin" target="_blank" title="go to my linkedin profile" className="z-1">
        <LinkedinIcon className="size-3/4" />
      </Link>
    </Card>
  );
};
