import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { NAV_ITEMS } from "@/components/foreman/nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Foreman — the AI that handles your paperwork" },
      {
        name: "description",
        content:
          "Foreman is an AI workplace assistant for emails, meeting notes, scheduling and research. Four tools, plain language, everything editable before you send it.",
      },
      { property: "og:title", content: "Foreman — the AI that handles your paperwork" },
      {
        property: "og:description",
        content: "Emails, meeting write-ups, schedules and research briefs — drafted, then yours to edit.",
      },
    ],
  }),
  component: Workbench,
});

function Workbench() {
  return (
    <>
      <header className="mb-10 border-b border-border pb-10">
        <p className="font-mono text-xs tracking-[0.2em] text-primary">THE WORKBENCH</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl">
          Paperwork,
          <br />
          handled.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
          Foreman drafts the writing nobody wants to do — emails, meeting write-ups, schedules and
          research briefs. Every draft lands editable, so the last word stays yours.
        </p>
      </header>

      <div className="grid gap-px bg-border sm:grid-cols-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex flex-col justify-between bg-card p-6 transition-colors hover:bg-muted"
          >
            <div>
              <span className="font-mono text-xs tracking-[0.2em] text-primary">
                {item.number}
              </span>
              <h2 className="mt-2 font-display text-2xl text-foreground">{item.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.blurb}</p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-foreground">
              Open
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Responsible AI — </span>
        Foreman writes first drafts, not final answers. Read everything before it leaves your desk,
        and check facts, names, figures and dates against your own records.
      </p>
    </>
  );
}
