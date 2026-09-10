import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, HardHat } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { NAV_ITEMS } from "./nav";
import { cn } from "@/lib/utils";

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      <Link
        to="/"
        onClick={onNavigate}
        className={cn(
          "group flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm tracking-wide transition-colors",
          pathname === "/"
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
      >
        <span className="font-mono text-xs text-sidebar-foreground/40">00</span>
        <span className="font-medium">Workbench</span>
      </Link>

      <div className="my-3 h-px bg-sidebar-border" />

      {NAV_ITEMS.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm tracking-wide transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <span
              className={cn(
                "font-mono text-xs",
                active ? "text-sidebar-primary" : "text-sidebar-foreground/40",
              )}
            >
              {item.number}
            </span>
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        <Link to="/" onClick={onNavigate} className="mb-8 flex items-center gap-3 px-2">
          <HardHat className="size-5 text-sidebar-primary" aria-hidden="true" />
          <span className="font-display text-2xl leading-none text-sidebar-foreground">
            Foreman
          </span>
        </Link>
        <NavList onNavigate={onNavigate} />
      </div>
      <p className="px-3 text-xs leading-relaxed text-sidebar-foreground/45">
        AI drafts the paperwork. You sign it off.
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar md:block">
        <SidebarInner />
      </aside>

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-sidebar px-4 py-3 md:hidden">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-sm p-1.5 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <span className="font-display text-xl text-sidebar-foreground">Foreman</span>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-sidebar shadow-xl">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-sm p-1.5 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="size-5" />
            </button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="md:pl-64">
        <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">{children}</div>
      </main>
    </div>
  );
}
