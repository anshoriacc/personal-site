import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import { BASE_URL } from "@/constants/env";
import Providers from "@/components/providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL ?? "/"),
  title: {
    default: "Achmad Anshori",
    template: "%s – Achmad Anshori",
  },
  description: "a Software Engineer, Frontend.",
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: {
      default: "Achmad Anshori",
      template: "%s – Achmad Anshori",
    },
    description: "a Software Engineer, Frontend.",
    siteName: "Achmad Anshori",
    images: [
      { url: "/api/og", width: 1200, height: 630, alt: "Achmad Anshori" },
    ],
  },
  twitter: {
    title: {
      default: "Achmad Anshori",
      template: "%s – Achmad Anshori",
    },
    images: [
      { url: "/api/og", width: 1200, height: 630, alt: "Achmad Anshori" },
    ],
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={plusJakartaSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
