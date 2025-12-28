import { getCurrentlyPlaying } from "@/data/spotify";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentlyPlayingQuery = () =>
  useQuery({
    queryKey: ["currently-playing"],
    queryFn: getCurrentlyPlaying,
    staleTime: 30 * 1000,
  });
