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
import { researchTopic } from "@/lib/foreman.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research — Foreman plain-language briefs" },
      {
        name: "description",
        content:
          "Enter a topic, question or pasted text and get a plain-language summary, key points, and a practical recommendation.",
      },
      { property: "og:title", content: "Research — Foreman plain-language briefs" },
      {
        property: "og:description",
        content: "Plain-language summary, 3-5 key points and a practical next step on any topic.",
      },
    ],
  }),
  component: Research,
});

function Research() {
  const call = useServerFn(researchTopic);
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [points, setPoints] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await call({ data: { query } });
      setSummary(result.summary);
      setPoints(result.keyPoints);
      setRecommendation(result.recommendation);
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
    "KEY POINTS",
    ...points.map((p) => `- ${p}`),
    "",
    "RECOMMENDATION",
    recommendation,
  ].join("\n");

  return (
    <>
      <ToolHeader
        number="04"
        title="Research"
        intro="Ask a question, name a topic, or paste something dense. Foreman gives you the plain-language version."
      />
      <Disclaimer>
        this is written from training data, not a live search, so prices, rules, laws and anything
        time-sensitive may be out of date. Check current sources before you act on it.
      </Disclaimer>

      <Panel title="The question">
        <div className="space-y-4">
          <Label htmlFor="query" className="sr-only">
            Topic, question or text
          </Label>
          <Textarea
            id="query"
            rows={6}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What should a small firm know about switching to four-day weeks?"
          />
          <Button onClick={submit} disabled={loading || !query.trim()}>
            {loading ? "Looking into it…" : "Get the brief"}
          </Button>
        </div>
      </Panel>

      {error ? <ErrorNote message={error} /> : null}

      {done ? (
        <>
          <Panel title="Summary" action={<CopyButton value={summary} />}>
            <Textarea rows={5} value={summary} onChange={(e) => setSummary(e.target.value)} />
          </Panel>

          <Panel title="Key points">
            <div className="space-y-2">
              {points.map((p, i) => (
                <Input
                  key={i}
                  value={p}
                  onChange={(e) => setPoints(points.map((v, j) => (i === j ? e.target.value : v)))}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Recommendation" action={<CopyButton value={recommendation} />}>
            <Textarea
              rows={3}
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
            />
          </Panel>

          <div className="flex justify-end">
            <CopyButton value={plainText} label="Copy brief" />
          </div>
        </>
      ) : null}
    </>
  );
}
