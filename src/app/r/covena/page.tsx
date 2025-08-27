import { Metadata } from "next/types";

import { cn } from "@/lib/utils";
import { SidebarDemo } from "@/components/covena/sidebar-demo";
import conversationImage from "@/assets/r/covena/covena-conversation.jpeg";
import automationImage from "@/assets/r/covena/covena-automation.jpeg";
import chartsImage from "@/assets/r/covena/covena-charts.jpeg";
import Image from "next/image";
import { ImageZoom } from "@/components/ui/image-zoom";
import { AutomationCard } from "@/components/covena/automation-card";

export const metadata: Metadata = {
  title: "My Perspective on Covena CRM's User Experience",
  description:
    "I highlight key opportunities to improve the clarity, hierarchy, and usability of three Covena CRM screens: Automations, Analytics, and Conversations. The goal is to create a more intuitive flow, reduce visual clutter, and strengthen the overall user experience while maintaining consistency with modern design standards.",
};

export default async function CovenaPage() {
  return (
    <article
      className={cn(
        "space-y-6 text-neutral-400",
        "[&_h1]:text-foreground [&_h1]:text-lg [&_h1]:font-semibold",
        "[&_h2]:text-foreground [&_h2]:font-semibold",
        "[&_figure>div]:overflow-hidden [&_figure>div]:rounded-xl [&_figure>div]:border",
        "[&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-neutral-500",
      )}>
      <div className="space-y-6">
        <h1>My Perspective on Covena CRM&apos;s User Experience</h1>

        <p>
          I highlight key opportunities to improve the clarity, hierarchy, and
          usability of three Covena CRM screens: Automations, Analytics, and
          Conversations. The goal is to create a more intuitive flow, reduce
          visual clutter, and strengthen the overall user experience while
          maintaining consistency with modern design standards.
        </p>
      </div>

      <a href="#automations" className="mt-16 block">
        <h2 id="automations">Automations</h2>
      </a>

      <p>
        I will start from automations page, one of the first things I noticed
        was the lack of clear visual hierarchy.
      </p>

      <figure>
        <div>
          <ImageZoom>
            <Image
              src={automationImage}
              alt="Automations Page UI"
              className="scale-101"
            />
          </ImageZoom>
        </div>
        <figcaption>Automations Page UI</figcaption>
      </figure>

      <p>
        In the sidebar, I noticed there are some opportunities for improvement
        from my perspective. First is the label of the group items, I think it
        should be better to stay in left for better readability in left aligned
        text.
      </p>

      <p>
        I also noticed the logout button and theme toggle placements can be
        improved. The improvement is to move them under avatar dropdown because
        of several reasons, including reducing visual clutter and improving
        accessibility. Logout button and theme toggle are low frequency actions,
        users dont need to access them frequently, so it makes sense to place
        them in a less prominent position.
      </p>

      <p>
        Logout button also destructive to the current sessions, so it&apos;s
        better hiding inside a dropdown menu to reduce accidental clicks. I
        think this patterns is widely used in so many web app nowadays. We can
        see the improved placement from the example provided below.
      </p>

      <SidebarDemo />

      <p>
        We can see after the improvement, the sidebar looks more organized and
        less cluttered.
      </p>

      <p>
        The next thing I noticed from the automations page is hierarchy. We need
        to clarify hierarchy from every automation card. We can start from
        moving the label status badge to the top right next to the automations
        title so then the user can easily identify the status of each automation
        at a glance. I think we should also consider adding more visual cues,
        such as icons or color coding, to further enhance the hierarchy and make
        it easier for users to scan and understand the information presented.
      </p>

      <AutomationCard />

      <p>
        We can see that after the improvement I made, the automation cards are
        now more visually distinct and easier to scan. I also reduced the action
        buttons, to prioritize edit & start/pause and move the other to the
        kebab dropdown menu for a cleaner look.
      </p>

      <a href="#conversations" className="mt-16 block">
        <h2 id="conversations">Conversations</h2>
      </a>

      <p>
        Next parts is conversations page. Just like the previous page, I think
        hieararchy in this page also need to be improved.
      </p>

      <figure>
        <div>
          <ImageZoom>
            <Image
              src={conversationImage}
              alt="Conversations Page"
              className="scale-101"
            />
          </ImageZoom>
        </div>
        <figcaption>Conversations Page</figcaption>
      </figure>

      <p>
        First that I noticed from this page is, the chat list show colored chips
        (AI Agent, ongoing-qa, etc). I think we need to unify it to reduce
        noise. Second one is the time semantics on chat list, I think we need to
        add a hover effect to show the complete time information. This way,
        users can quickly scan relative times (like "2h ago") but still access
        the exact timestamp when needed, improving clarity without cluttering
        the UI.
      </p>

      <a href="#analytics" className="mt-16 block">
        <h2 id="analytics">Analytics</h2>
      </a>

      <p>
        This page shows 2 big donut charts that show successful payments and
        conversations.
      </p>

      <figure>
        <div>
          <ImageZoom>
            <Image
              src={chartsImage}
              alt="Analytics Page"
              className="scale-101"
            />
          </ImageZoom>
        </div>
        <figcaption>Analytics Page</figcaption>
      </figure>

      <p>
        My take on this page is that the donut charts are effective in conveying
        the overall trends at a glance, but they could benefit from additional
        context or detail on hover to provide more insights without overwhelming
        the user.
      </p>

      <p>
        I personally dont like donut charts, I think donut consume more spaces
        than charts like bar charts, but I dont know the context, with a right
        context, they could be more effective.
      </p>

      <p>
        The colors need to improve because purple and blue are low contrast
        (even tho I know its Covena's color brand), but I think user's
        accessibility and readability should take priority. Consider using
        higher contrast colors or providing alternative color schemes for better
        visibility, especially for users with visual impairments.
      </p>
    </article>
  );
}
