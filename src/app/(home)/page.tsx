import { QueryClient } from "@tanstack/react-query";

import { getCurrentlyPlaying } from "@/data/spotify";
import { Location } from "@/components/location";
import { Profile } from "@/components/profile";
import { Spotify } from "@/components/spotify";
import { MoreTiles } from "@/components/more";
import { Social } from "@/components/social";
import { Resume } from "@/components/resume";

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["currently-playing"],
    queryFn: getCurrentlyPlaying,
  });

  return (
    <main className="flex flex-wrap gap-6">
      <Profile />
      <Location />
      <Resume />
      <Social />
      <Spotify />
      <MoreTiles />
    </main>
  );
}
