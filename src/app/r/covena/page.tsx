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
        Logout button also destructive to the current sessions, so it&apos;s better
        hiding inside a dropdown menu to reduce accidental clicks. I think this
        patterns is widely used in so many web app nowadays. We can see the
        improved placement from the example provided below.
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

      <a href="#conversations" className="mt-16 block">
        <h2 id="conversations">Conversations</h2>
      </a>

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

      <a href="#analytics" className="mt-16 block">
        <h2 id="analytics">Analytics</h2>
      </a>

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

      <LoremIpsum />
    </article>
  );
}

const LoremIpsum = () => {
  return (
    <section className="space-y-6">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        fermentum tellus in ornare facilisis. Aliquam molestie molestie mi vel
        interdum. Duis faucibus sem ut maximus ullamcorper. Aenean vel varius
        tortor, sed gravida diam. Quisque at velit efficitur, gravida erat vel,
        vehicula quam. Duis id odio et elit accumsan dictum eget sed lorem.
        Nulla sollicitudin eros mauris, faucibus egestas risus aliquet quis.
        Nunc blandit felis nibh, sit amet porta mauris maximus vitae. Nulla
        vulputate turpis sed euismod sollicitudin. Duis sit amet metus at mauris
        iaculis cursus ut non urna. Vestibulum efficitur enim nulla, quis cursus
        ipsum efficitur quis. Aenean eget hendrerit dolor, vitae sollicitudin
        quam. Ut aliquet libero ipsum, ac laoreet quam lacinia in. Nunc pharetra
        nulla ac luctus sollicitudin. Phasellus mollis imperdiet ultricies.
      </p>
      <p>
        Sed sed eros at enim malesuada pharetra lacinia et orci. Mauris rutrum
        commodo velit eu rhoncus. Aliquam felis sem, dapibus ac lacinia at,
        iaculis vitae libero. Praesent nibh mi, congue id risus eu, rutrum
        ullamcorper metus. Pellentesque habitant morbi tristique senectus et
        netus et malesuada fames ac turpis egestas. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Maecenas vestibulum, purus in lobortis
        ultrices, ante orci vulputate orci, quis faucibus quam massa ut mauris.
        Nulla sed aliquam lacus, eget mollis enim. Morbi vulputate, augue sit
        amet bibendum tincidunt, purus sapien iaculis orci, vel tincidunt arcu
        odio sit amet risus. Aliquam at nunc vulputate nulla feugiat porta. Nam
        feugiat neque quis maximus iaculis.
      </p>
      <p>
        Vivamus tincidunt urna ut feugiat hendrerit. Mauris eu lacus vitae est
        pellentesque euismod. Nam arcu nisi, tempor vel tortor sed, dictum
        tincidunt est. Proin in eleifend nulla. Proin nec luctus velit.
        Phasellus dictum dolor id ligula vulputate vestibulum. Nunc accumsan
        velit nisi, sit amet semper ligula convallis in. Pellentesque sed nisi
        eros. Vestibulum tempor iaculis leo, a feugiat mauris eleifend a. Nunc
        pellentesque venenatis gravida. Nulla vitae ullamcorper ligula. Donec
        venenatis viverra nunc, vel cursus tortor molestie sed.
      </p>
      <p>
        Integer posuere leo vitae nibh lobortis tempus. Donec leo erat, accumsan
        sit amet mollis rhoncus, mattis nec turpis. Pellentesque id sem a tellus
        molestie tempus. Vivamus enim dui, eleifend at ligula vitae, tempor
        sodales purus. Nullam rhoncus ipsum consectetur, vulputate lectus vel,
        blandit mi. Praesent a lectus consequat, viverra metus eu, facilisis
        magna. Vivamus ut aliquam felis, placerat facilisis dui. Vivamus in
        dignissim velit. Pellentesque eu enim nisl. Phasellus a convallis urna.
      </p>
      <p>
        Praesent vulputate sed velit a pharetra. Nulla et diam eget mi varius
        congue. Curabitur blandit volutpat enim a facilisis. Maecenas et augue
        vitae nibh euismod auctor sit amet et nulla. Phasellus condimentum
        scelerisque est in venenatis. Proin sodales efficitur lectus quis
        facilisis. Mauris odio ex, ornare a eros et, dapibus blandit justo. In
        vitae augue cursus, mattis dolor nec, varius nisi. Mauris vel ante eu
        orci molestie porta.
      </p>
      <p>
        In vitae eros rhoncus, fermentum turpis quis, sollicitudin eros.
        Curabitur sit amet consectetur massa, ac porta mi. Nullam ut blandit
        est. Interdum et malesuada fames ac ante ipsum primis in faucibus.
        Aliquam urna metus, tristique eget sodales porttitor, vulputate eget
        orci. Vivamus congue vehicula aliquet. Quisque id lacus posuere, sodales
        leo rhoncus, sodales arcu. Fusce facilisis rhoncus turpis eget molestie.
        Sed vel mauris sed dolor laoreet dapibus. Maecenas rhoncus bibendum
        lorem, in pulvinar risus lobortis eget. Curabitur eget metus mauris.
        Duis rhoncus tellus justo, at sodales turpis suscipit ut.
      </p>
      <p>
        Vivamus nec iaculis nibh, non ullamcorper risus. Mauris at rutrum odio.
        Pellentesque at tempor ex, ut condimentum nunc. Praesent ligula orci,
        volutpat ac ligula ut, semper condimentum eros. Praesent tristique non
        tellus viverra sagittis. Phasellus nibh justo, ultricies et sodales ac,
        semper quis sem. Sed in sollicitudin sapien, blandit hendrerit erat. In
        sed metus eget enim iaculis eleifend. Nulla facilisi. Sed euismod nisi
        accumsan varius mollis. Phasellus mollis dui libero. Mauris id vulputate
        dolor, in scelerisque leo. Duis dapibus turpis odio, vel tempor libero
        egestas a. Phasellus neque leo, pretium id sagittis interdum, malesuada
        eu tortor.
      </p>

      <p>
        Phasellus et bibendum nisi, non euismod sem. Mauris venenatis fringilla
        dapibus. Phasellus bibendum suscipit orci, sit amet efficitur ipsum
        vulputate sed. Vestibulum ante ipsum primis in faucibus orci luctus et
        ultrices posuere cubilia curae; Aliquam vitae sapien accumsan, lobortis
        velit sit amet, ultricies lorem. Mauris ut nisi non dui tempor gravida
        vel vitae risus. Aenean sodales dui sed dolor imperdiet posuere. Sed
        tempor vel augue sit amet efficitur. Cras ut urna sit amet nulla
        fringilla fringilla a at lectus. Nam rhoncus, lectus sollicitudin
        aliquet finibus, metus purus egestas nisl, nec placerat nunc lorem ut
        leo. Quisque malesuada turpis turpis, in cursus mauris sodales sed.
        Phasellus vulputate nulla a cursus fermentum. Integer at erat semper,
        consequat neque vel, dictum purus. Donec sed mattis ligula.
      </p>
      <p>
        Nunc viverra congue dolor, quis fringilla dolor efficitur ac.
        Suspendisse sagittis ligula erat, nec feugiat leo varius tristique.
        Proin laoreet non lacus ultricies ultricies. Etiam vehicula est velit,
        et posuere urna posuere quis. Aenean ex enim, volutpat id vulputate vel,
        luctus vitae nisl. Phasellus vel magna eget metus scelerisque
        scelerisque et nec orci. Curabitur turpis erat, posuere eleifend lectus
        eget, molestie maximus quam. Mauris consequat magna eu eros sagittis
        bibendum. Praesent vitae tortor posuere, sodales magna ut, egestas
        tellus. Maecenas laoreet commodo massa, sit amet tristique orci faucibus
        a. Curabitur pretium varius elementum. In volutpat ex a ligula porta, a
        faucibus tortor varius. Fusce mi mi, commodo eget tortor et, dignissim
        maximus metus.
      </p>
      <p>
        Nam et ipsum eget lorem lobortis efficitur. Cras varius tortor lectus,
        nec tincidunt justo luctus eget. Mauris bibendum augue et semper tempus.
        Sed ultricies nibh a consectetur molestie. Pellentesque malesuada augue
        eget ex congue scelerisque vitae nec mi. Ut a ex lobortis, commodo diam
        vel, sollicitudin urna. Nunc sodales viverra nibh, id sagittis neque
        tristique et. Morbi consectetur suscipit ante tristique laoreet.
        Vestibulum eleifend dui at nisl posuere sagittis. Nam et felis
        vestibulum, pretium ex vitae, tempus quam.
      </p>
    </section>
  );
};
