import { useQuery } from "@tanstack/react-query";
import { getCurrentlyPlaying } from "@/server/actions/spotify";

export const useGetCurrentlyPlayingQuery = () =>
  useQuery({
    queryKey: ["currently-playing"],
    queryFn: getCurrentlyPlaying,
  });
