import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import {
  CopyButton,
  Disclaimer,
  ErrorNote,
  Panel,
  ToolHeader,
} from "@/components/foreman/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planSchedule } from "@/lib/foreman.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — Foreman task planner" },
      {
        name: "description",
        content:
          "List your tasks and deadlines, choose a day or week view, and get a prioritised schedule with the reasoning behind the order.",
      },
      { property: "og:title", content: "Schedule — Foreman task planner" },
      {
        property: "og:description",
        content: "A prioritised day or week plan, with a short reason for every slot.",
      },
    ],
  }),
  component: Schedule,
});

type Item = { slot: string; task: string; reasoning: string };

function Schedule() {
  const call = useServerFn(planSchedule);
  const [tasks, setTasks] = useState("");
  const [view, setView] = useState<"day" | "week">("day");
  const [overview, setOverview] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!tasks.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await call({ data: { tasks, view } });
      setOverview(result.overview);
      setItems(result.items);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const plainText = [
    overview,
    "",
    ...items.map((i) => `${i.slot} — ${i.task}\n   why: ${i.reasoning}`),
  ].join("\n");

  return (
    <>
      <ToolHeader
        number="03"
        title="Schedule"
        intro="Give Foreman the job list and the deadlines. You get an order of work with the reasoning spelled out."
      />
      <Disclaimer>
        the plan is a suggestion, not a commitment. Re-check every deadline and any dependency on
        other people before you build your day around it.
      </Disclaimer>

      <Panel title="Job list">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tasks">Tasks and deadlines, one per line</Label>
            <Textarea
              id="tasks"
              rows={8}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"Finish safety report — due Wednesday\nCall supplier about steel order\nReview two CVs — end of week"}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex border border-border">
              {(["day", "week"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    "px-4 py-1.5 text-sm capitalize transition-colors",
                    view === v
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <Button onClick={submit} disabled={loading || !tasks.trim()}>
              {loading ? "Working it out…" : "Build the schedule"}
            </Button>
          </div>
        </div>
      </Panel>

      {error ? <ErrorNote message={error} /> : null}

      {done ? (
        <>
          <Panel title="The approach" action={<CopyButton value={overview} />}>
            <Textarea rows={3} value={overview} onChange={(e) => setOverview(e.target.value)} />
          </Panel>

          <Panel title={`${view} plan`}>
            <div className="space-y-5">
              {items.map((item, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[11rem_1fr]">
                  <Input
                    value={item.slot}
                    onChange={(e) =>
                      setItems(items.map((v, j) => (i === j ? { ...v, slot: e.target.value } : v)))
                    }
                    className="font-mono text-xs"
                  />
                  <div className="space-y-2">
                    <Input
                      value={item.task}
                      onChange={(e) =>
                        setItems(
                          items.map((v, j) => (i === j ? { ...v, task: e.target.value } : v)),
                        )
                      }
                    />
                    <Input
                      value={item.reasoning}
                      onChange={(e) =>
                        setItems(
                          items.map((v, j) => (i === j ? { ...v, reasoning: e.target.value } : v)),
                        )
                      }
                      className="text-xs text-muted-foreground"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <div className="flex justify-end">
            <CopyButton value={plainText} label="Copy schedule" />
          </div>
        </>
      ) : null}
    </>
  );
}
