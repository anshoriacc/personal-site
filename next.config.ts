import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  redirects: async () => [
    {
      source: "/spotify",
      destination: "https://open.spotify.com/user/312wkcarckpr64ibtf3jvgnvpnyi",
      permanent: true,
    },
    {
      source: "/github",
      destination: "https://github.com/anshoriacc",
      permanent: true,
    },
    {
      source: "/linkedin",
      destination: "https://www.linkedin.com/in/achmad-anshori",
      permanent: true,
    },
  ],
};

export default nextConfig;
