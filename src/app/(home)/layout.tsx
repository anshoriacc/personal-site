import { Header } from "@/components/header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark relative cursor-default select-none">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(200, 200, 200, 0.15), transparent 70%), transparent",
        }}
      />
      <div className="mx-auto min-h-dvh w-full max-w-2xl p-4 pt-[88px]">
        <Header />

        {children}
      </div>
    </div>
  );
}
