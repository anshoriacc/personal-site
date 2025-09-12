import { BASE_URL } from "@/constants/env";
import { ImageResponse } from "next/og";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");
  const subtitle = searchParams.get("subtitle");

  const baseUrl = BASE_URL ?? "https://anshori.com";

  return new ImageResponse(
    (
      <div tw="flex relative p-4 flex-col bg-black w-full h-full items-center justify-center">
        {title && (
          <div tw="flex flex-col items-center justify-center text-center space-y-4">
            <span tw="text-white text-6xl">{title}</span>
            {subtitle && <span tw="text-neutral-500 text-2xl mt-2">{subtitle}</span>}
          </div>
        )}

        <img
          src={baseUrl + "/192x192.png"}
          alt="icon"
          width={title ? 64 : 256}
          height={title ? 64 : 256}
          tw={title ? "absolute top-8 right-8" : ""}
        />

        <div tw="absolute bottom-8 left-8 flex flex-col text-neutral-500">
          <span tw="text-white text-5xl">anshori</span>
          <span tw="text-4xl">Software Engineer</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
