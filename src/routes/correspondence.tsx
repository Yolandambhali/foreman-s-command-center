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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/foreman.functions";

export const Route = createFileRoute("/correspondence")({
  head: () => ({
    meta: [
      { title: "Correspondence — Foreman email drafting" },
      {
        name: "description",
        content:
          "Describe what your work email needs to say, pick a tone, and get an editable subject line and body ready to copy.",
      },
      { property: "og:title", content: "Correspondence — Foreman email drafting" },
      {
        property: "og:description",
        content: "Draft formal, friendly, persuasive, apologetic or direct work emails in seconds.",
      },
    ],
  }),
  component: Correspondence,
});

const TONES = ["formal", "friendly", "persuasive", "apologetic", "direct"] as const;

function Correspondence() {
  const call = useServerFn(generateEmail);
  const [brief, setBrief] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("formal");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!brief.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await call({ data: { brief, tone } });
      setSubject(result.subject);
      setBody(result.body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToolHeader
        number="01"
        title="Correspondence"
        intro="Say what the email needs to get across. Foreman writes the subject line and the body — you edit and send."
      />
      <Disclaimer>
        drafts can sound confident and still be wrong. Check every name, figure, date and
        commitment against your own records before you hit send.
      </Disclaimer>

      <Panel title="The brief">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brief">What does the email need to say?</Label>
            <Textarea
              id="brief"
              rows={6}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Tell the client the delivery slipped to Friday, apologise for the short notice, offer a call Thursday."
            />
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-48 space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as (typeof TONES)[number])}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={submit} disabled={loading || !brief.trim()}>
              {loading ? "Drafting…" : "Draft the email"}
            </Button>
          </div>
        </div>
      </Panel>

      {error ? <ErrorNote message={error} /> : null}

      {subject || body ? (
        <>
          <Panel title="Subject" action={<CopyButton value={subject} />}>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </Panel>
          <Panel title="Body" action={<CopyButton value={body} />}>
            <Textarea
              rows={14}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="leading-relaxed"
            />
          </Panel>
          <div className="flex justify-end">
            <CopyButton value={`Subject: ${subject}\n\n${body}`} label="Copy whole email" />
          </div>
        </>
      ) : null}
    </>
  );
}
