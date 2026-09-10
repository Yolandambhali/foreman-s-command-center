import { Copy, Check, TriangleAlert } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function ToolHeader({
  number,
  title,
  intro,
}: {
  number: string;
  title: string;
  intro: string;
}) {
  return (
    <header className="mb-8">
      <p className="font-mono text-xs tracking-[0.2em] text-primary">{number}</p>
      <h1 className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{intro}</p>
    </header>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 flex gap-3 border-l-2 border-primary bg-muted/60 px-4 py-3">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <p className="text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Responsible AI — </span>
        {children}
      </p>
    </div>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-6 border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p className="mb-6 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      {message}
    </p>
  );
}
