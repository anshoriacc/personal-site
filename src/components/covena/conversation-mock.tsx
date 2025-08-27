"use client";
import React, { useMemo, useState } from "react";

// Conversation types
type Message = {
  id: string;
  from: "agent" | "user" | "system";
  text: string;
  time: string; // e.g. "11:31 AM"
  meta?: string; // e.g. template name or status
};

type Thread = {
  id: string;
  name: string;
  preview: string;
  unread?: boolean;
  lastTime: string;
  tag?: "ongoing" | "no_response" | "not_interested";
};

const mockThreads: Thread[] = [
  {
    id: "t1",
    name: "Sari 🌹",
    preview: "Baik Ibu, silakan didiskusikan dulu dengan putri/putra Ibu...",
    unread: true,
    lastTime: "1m",
    tag: "ongoing",
  },
  {
    id: "t2",
    name: "Rini Haryanti",
    preview: "You: template object",
    lastTime: "2m",
    tag: "no_response",
  },
  {
    id: "t3",
    name: "cinta",
    preview: "You: Terima kasih atas waktunya...",
    lastTime: "1m",
    tag: "not_interested",
  },
];

const mockMessages: Message[] = [
  {
    id: "m1",
    from: "user",
    text: "Kalau untuk SMK dan SMU ada perbedaan pelajaran tdk? Karna anak sy SMK",
    time: "11:26 AM",
  },
  {
    id: "m2",
    from: "agent",
    text: "Untuk kelas 11 SMK bisa mengambil paket matematika merdeka.",
    time: "11:27 AM",
  },
  {
    id: "m3",
    from: "system",
    text: "TEMPLATE disisipkan: fu_ongoingqa",
    meta: "fu_ongoingqa",
    time: "11:31 AM",
  },
  {
    id: "m4",
    from: "agent",
    text: "Ibu, mohon didiskusikan pilihan jadwal yang tersedia dengan putri/putra Ibu, dan kabari kakak setelah Ibu sudah menentukan pilihan.",
    time: "11:31 AM",
  },
];

const tagStyles: Record<NonNullable<Thread["tag"]>, string> = {
  ongoing: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100",
  no_response: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-100",
  not_interested: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-100",
};

function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function SectionCard({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-zinc-200/60 bg-white shadow-sm">
      <button
        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left"
        onClick={() => setOpen(v => !v)}>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
          <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
        </div>
        <span className="text-xs text-zinc-500">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="border-t border-zinc-100 px-4 py-4 text-sm text-zinc-700">
          {children}
        </div>
      )}
    </div>
  );
}

function Sidebar({
  threads,
  activeId,
  onPick,
}: {
  threads: Thread[];
  activeId?: string;
  onPick: (id: string) => void;
}) {
  return (
    <aside className="flex h-full flex-col border-r border-zinc-200/60 bg-white/60 backdrop-blur-sm">
      {/* Top filters */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          <input
            placeholder="Search conversations"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Pill className="bg-zinc-100 text-zinc-700">Mine</Pill>
          <Pill className="bg-zinc-100 text-zinc-700">Unassigned</Pill>
          <Pill className="bg-indigo-600 text-white">All (1051)</Pill>
        </div>
      </div>

      {/* List */}
      <div className="mt-1 grid gap-1 overflow-auto p-2">
        {threads.map(t => (
          <button
            key={t.id}
            onClick={() => onPick(t.id)}
            className={`group flex flex-col gap-1 rounded-xl p-3 text-left transition hover:bg-indigo-50 ${
              t.id === activeId
                ? "bg-indigo-50 ring-1 ring-indigo-200"
                : "border border-zinc-200 bg-white"
            }`}>
            <div className="flex items-center justify-between">
              <div className="truncate text-sm font-medium text-zinc-900">
                {t.name}
              </div>
              <div className="shrink-0 text-xs text-zinc-400 tabular-nums">
                {t.lastTime}
              </div>
            </div>
            <div className="truncate text-xs text-zinc-500">{t.preview}</div>
            {t.tag && (
              <div className="mt-1">
                <Pill className={tagStyles[t.tag]}>
                  {t.tag === "ongoing" && "Ongoing"}
                  {t.tag === "no_response" && "No response"}
                  {t.tag === "not_interested" && "Not interested"}
                </Pill>
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const common =
    "max-w-[70ch] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm";
  const styles = {
    user: `${common} bg-white border border-zinc-200`,
    agent: `${common} bg-indigo-600 text-white`,
    system: `${common} bg-zinc-50 text-zinc-600 border border-dashed border-zinc-200`,
  } as const;

  return (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] tracking-wide text-zinc-400 uppercase">
        {msg.from === "agent"
          ? "You"
          : msg.from === "user"
            ? "Customer"
            : "System"}
        <span className="mx-1">•</span>
        <span>{msg.time}</span>
      </div>
      <div className={styles[msg.from] as string}>
        {msg.text}
        {msg.meta && (
          <div className="mt-1.5 text-[10px] text-zinc-400">
            Inserted template: <span className="font-medium">{msg.meta}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Composer() {
  const [showTemplates, setShowTemplates] = useState(false);
  const templates = [
    { id: "t1", name: "FU – Ongoing QA" },
    { id: "t2", name: "FU – No response (24h)" },
    { id: "t3", name: "Send form (ID)" },
  ];

  return (
    <div className="sticky bottom-0 z-10 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
      <div className="flex items-end gap-2">
        <textarea
          rows={2}
          placeholder="Type your reply…"
          className="min-h-[44px] w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200"
        />
        <button className="h-10 shrink-0 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700">
          Send
        </button>
        <div className="relative">
          <button
            onClick={() => setShowTemplates(v => !v)}
            className="h-10 shrink-0 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50">
            Insert Template
          </button>
          {showTemplates && (
            <div className="absolute right-0 bottom-12 z-20 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
              <div className="border-b border-zinc-100 px-3 py-2 text-xs text-zinc-500">
                Quick templates
              </div>
              <ul className="max-h-60 divide-y divide-zinc-100 overflow-auto">
                {templates.map(t => (
                  <li key={t.id}>
                    <button className="block w-full px-3 py-2 text-left text-sm hover:bg-indigo-50">
                      {t.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-2">
          <Pill className="bg-zinc-100 text-zinc-700">Attach</Pill>
          <Pill className="bg-zinc-100 text-zinc-700">Emoji</Pill>
        </div>
        <div className="text-xs text-zinc-400">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}

function DetailsPanel() {
  return (
    <aside className="h-full space-y-3 overflow-auto">
      <SectionCard title="Parent Info">
        <dl className="grid grid-cols-3 gap-2 text-sm">
          <dt className="col-span-1 text-zinc-500">Name</dt>
          <dd className="col-span-2 font-medium">Sari</dd>
          <dt className="col-span-1 text-zinc-500">Phone</dt>
          <dd className="col-span-2">+62 •••• ••••</dd>
          <dt className="col-span-1 text-zinc-500">Email</dt>
          <dd className="col-span-2">—</dd>
        </dl>
      </SectionCard>
      <SectionCard title="Child Info">
        <div className="space-y-2">
          <div className="rounded-xl border border-zinc-200 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Grade</div>
              <Pill className="bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 ring-inset">
                11 – SMA
              </Pill>
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              Checkout link • Expires in 2 days
            </div>
          </div>
          <button className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50">
            Add Schedule
          </button>
        </div>
      </SectionCard>
      <SectionCard title="Conversation Controls" defaultOpen={false}>
        <div className="grid gap-2">
          <button className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            Escalate to Human
          </button>
          <button className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100">
            Mark Not Interested
          </button>
        </div>
      </SectionCard>
    </aside>
  );
}

export default function ConversationUIMock() {
  const [activeId, setActiveId] = useState("t1");
  const thread = useMemo(
    () => mockThreads.find(t => t.id === activeId)!,
    [activeId],
  );

  return (
    <div className="h-full min-h-[720px] w-full bg-gradient-to-br from-white via-zinc-50 to-white p-4">
      {/* App shell header */}
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-600" />
          <h1 className="text-lg font-semibold text-zinc-900">Inbox</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            Analytics
          </button>
          <button className="rounded-xl bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white">
            New Chat
          </button>
        </div>
      </header>

      {/* 3-column responsive grid */}
      <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 md:grid-cols-[280px_1fr_320px]">
        {/* Sidebar */}
        <Sidebar
          threads={mockThreads}
          activeId={activeId}
          onPick={setActiveId}
        />

        {/* Thread */}
        <main className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500" />
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  {thread.name}
                </div>
                <div className="text-xs text-zinc-500">
                  Active 1m ago • WhatsApp
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Pill className="bg-green-50 text-green-700 ring-1 ring-green-100 ring-inset">
                AI Assisting
              </Pill>
              <button className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">
                Assign
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-auto pr-1">
            {mockMessages.map(m => (
              <div
                key={m.id}
                className={
                  m.from === "agent" ? "ml-auto max-w-[70%]" : "max-w-[70%]"
                }>
                <Bubble msg={m} />
              </div>
            ))}
            <div className="py-10" />
          </div>

          {/* Composer */}
          <div className="mt-3">
            <Composer />
          </div>
        </main>

        {/* Details panel */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-3">
          <DetailsPanel />
        </div>
      </div>
    </div>
  );
}
