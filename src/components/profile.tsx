import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { MailIcon } from "./svg/mail-icon";
import { GithubIcon } from "./svg/github-icon";
import { LinkedInIcon } from "./svg/linkedin-icon";

export const Profile = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="sm:text-lg font-semibold">Achmad Anshori</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Software Engineer
        </p>
      </div>

      <p
        className={cn(
          "z-1 text-muted-foreground",
          "[&_span:hover]:text-foreground"
        )}
      >
        I'm a <span>software engineer</span> with more than 3 years of
        experience. I craft delightful user experiences with <span>React</span>{" "}
        and modern <span>JavaScript</span>. Currently based in{" "}
        <span>Jakarta, Indonesia</span>.
      </p>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-3xl gap-1"
          asChild
        >
          <Link href="mailto:anshoriacc@gmail.com">
            <MailIcon className="size-4" />
            Mail
          </Link>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-3xl gap-1"
          asChild
        >
          <Link href="/github" target="_blank">
            <GithubIcon className="size-4" />
            GitHub
          </Link>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-3xl gap-1"
          asChild
        >
          <Link
            href="/linkedin"
            target="_blank"
          >
            <LinkedInIcon className="size-5" />
            LinkedIn
          </Link>
        </Button>
      </div>
    </section>
  );
};
