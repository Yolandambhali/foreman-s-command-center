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
import { summarizeNotes } from "@/lib/foreman.functions";

export const Route = createFileRoute("/site-notes")({
  head: () => ({
    meta: [
      { title: "Site Notes — Foreman meeting summariser" },
      {
        name: "description",
        content:
          "Paste raw meeting notes or a transcript and get a clean summary, the decisions made, and action items with owners and deadlines.",
      },
      { property: "og:title", content: "Site Notes — Foreman meeting summariser" },
      {
        property: "og:description",
        content: "Turn messy notes into a summary, decisions and action items you can copy.",
      },
    ],
  }),
  component: SiteNotes,
});

type Action = { task: string; owner: string | null; deadline: string | null };

function SiteNotes() {
  const call = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [decisions, setDecisions] = useState<string[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!notes.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await call({ data: { notes } });
      setSummary(result.summary);
      setDecisions(result.decisions);
      setActions(result.actionItems);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const plainText = [
    "SUMMARY",
    summary,
    "",
    "DECISIONS",
    ...decisions.map((d) => `- ${d}`),
    "",
    "ACTION ITEMS",
    ...actions.map(
      (a) =>
        `- ${a.task}${a.owner ? ` (owner: ${a.owner})` : ""}${a.deadline ? ` (due: ${a.deadline})` : ""}`,
    ),
  ].join("\n");

  return (
    <>
      <ToolHeader
        number="02"
        title="Site Notes"
        intro="Drop in the raw notes or a transcript. Foreman pulls out what was agreed and who owes what."
      />
      <Disclaimer>
        owners and deadlines are only as good as the notes. Confirm every action item with the
        person named before treating it as agreed.
      </Disclaimer>

      <Panel title="Raw notes">
        <div className="space-y-4">
          <Label htmlFor="notes" className="sr-only">
            Raw notes or transcript
          </Label>
          <Textarea
            id="notes"
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting notes or transcript here…"
          />
          <Button onClick={submit} disabled={loading || !notes.trim()}>
            {loading ? "Sorting it out…" : "Write it up"}
          </Button>
        </div>
      </Panel>

      {error ? <ErrorNote message={error} /> : null}

      {done ? (
        <>
          <Panel title="Summary" action={<CopyButton value={summary} />}>
            <Textarea rows={5} value={summary} onChange={(e) => setSummary(e.target.value)} />
          </Panel>

          <Panel title="Decisions">
            <div className="space-y-2">
              {decisions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No clear decisions in these notes.</p>
              ) : (
                decisions.map((d, i) => (
                  <Input
                    key={i}
                    value={d}
                    onChange={(e) =>
                      setDecisions(decisions.map((v, j) => (i === j ? e.target.value : v)))
                    }
                  />
                ))
              )}
            </div>
          </Panel>

          <Panel title="Action items">
            <div className="space-y-4">
              {actions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No action items were mentioned.</p>
              ) : (
                actions.map((a, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-[1fr_10rem_10rem]">
                    <Input
                      value={a.task}
                      onChange={(e) =>
                        setActions(
                          actions.map((v, j) => (i === j ? { ...v, task: e.target.value } : v)),
                        )
                      }
                    />
                    <Input
                      value={a.owner ?? ""}
                      placeholder="Owner"
                      onChange={(e) =>
                        setActions(
                          actions.map((v, j) => (i === j ? { ...v, owner: e.target.value } : v)),
                        )
                      }
                    />
                    <Input
                      value={a.deadline ?? ""}
                      placeholder="Deadline"
                      onChange={(e) =>
                        setActions(
                          actions.map((v, j) => (i === j ? { ...v, deadline: e.target.value } : v)),
                        )
                      }
                    />
                  </div>
                ))
              )}
            </div>
          </Panel>

          <div className="flex justify-end">
            <CopyButton value={plainText} label="Copy write-up" />
          </div>
        </>
      ) : null}
    </>
  );
}
