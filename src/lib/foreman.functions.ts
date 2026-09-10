import { createServerFn } from "@tanstack/react-start";
import { streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3.8-flash";

function friendlyError(error: unknown): Error {
  const status =
    error && typeof error === "object" && "statusCode" in error
      ? (error as { statusCode?: number }).statusCode
      : undefined;

  if (status === 402) {
    return new Error("The AI workspace is out of credits. Add credits to keep the crew working.");
  }
  if (status === 403) {
    return new Error("AI access is currently blocked for this workspace.");
  }
  if (status === 429) {
    return new Error("Too many requests at once. Give it a moment and try again.");
  }
  if (status === 401) {
    return new Error("AI is not configured correctly for this project.");
  }
  return new Error(
    error instanceof Error && error.message
      ? error.message
      : "Something went wrong generating that. Try again.",
  );
}

async function run<T>(args: { system: string; prompt: string; schema: z.ZodType<T> }): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this project yet.");

  const gateway = createLovableAiGatewayProvider(apiKey, undefined, {
    structuredOutputs: true,
  });

  try {
    const result = streamText({
      model: gateway(MODEL),
      system: args.system,
      prompt: args.prompt,
      output: Output.object({ schema: args.schema }),
    });
    return (await result.output) as T;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error) && error.text) {
      try {
        const match = error.text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("no json");
        return args.schema.parse(JSON.parse(match[0]));
      } catch {
        throw new Error("The reply came back garbled. Try running it again.");
      }
    }
    throw friendlyError(error);
  }
}

const VOICE =
  "You are Foreman, a no-nonsense but warm job-site foreman who handles workplace paperwork. Write plainly, keep it tight, no filler, no emoji, no markdown syntax in field values.";

/* ---------------- Correspondence ---------------- */

const emailSchema = z.object({
  subject: z.string(),
  body: z.string(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        brief: z.string().min(1).max(6000),
        tone: z.enum(["formal", "friendly", "persuasive", "apologetic", "direct"]),
      })
      .parse(input),
  )
  .handler(({ data }) =>
    run({
      schema: emailSchema,
      system: `${VOICE} Write a complete work email. Return a short specific subject line and a body with greeting, paragraphs separated by blank lines, and a sign-off ending with "[Your name]". Never invent facts, names, figures or dates that were not supplied.`,
      prompt: `Tone: ${data.tone}\n\nWhat the email needs to say:\n${data.brief}`,
    }),
  );

/* ---------------- Site Notes ---------------- */

const notesSchema = z.object({
  summary: z.string(),
  decisions: z.array(z.string()),
  actionItems: z.array(
    z.object({
      task: z.string(),
      owner: z.string().nullable(),
      deadline: z.string().nullable(),
    }),
  ),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ notes: z.string().min(1).max(30000) }).parse(input),
  )
  .handler(({ data }) =>
    run({
      schema: notesSchema,
      system: `${VOICE} Turn raw meeting notes or a transcript into structure. Summary: 2-4 sentences. Decisions: only things actually decided. Action items: one task each, with owner and deadline only if stated in the notes, otherwise null. Do not invent anything.`,
      prompt: `Raw notes:\n${data.notes}`,
    }),
  );

/* ---------------- Schedule ---------------- */

const scheduleSchema = z.object({
  overview: z.string(),
  items: z.array(
    z.object({
      slot: z.string(),
      task: z.string(),
      reasoning: z.string(),
    }),
  ),
});

export const planSchedule = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        tasks: z.string().min(1).max(10000),
        view: z.enum(["day", "week"]),
      })
      .parse(input),
  )
  .handler(({ data }) =>
    run({
      schema: scheduleSchema,
      system: `${VOICE} Build a prioritised schedule. Overview: 1-3 sentences on the overall approach. Items: in the order they should be done. "slot" is a time block for a day plan (e.g. "08:00 - 09:30") or a day for a week plan (e.g. "Monday morning"). "reasoning" is one short sentence on why it sits there. Respect stated deadlines, front-load what is urgent and blocking.`,
      prompt: `View: ${data.view}\n\nTasks and deadlines:\n${data.tasks}`,
    }),
  );

/* ---------------- Research ---------------- */

const researchSchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()),
  recommendation: z.string(),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ query: z.string().min(1).max(20000) }).parse(input),
  )
  .handler(({ data }) =>
    run({
      schema: researchSchema,
      system: `${VOICE} Explain a topic, question or pasted text in plain language. Summary: a short plain-language paragraph, no jargon. keyPoints: 3 to 5 bullets. recommendation: one practical next step the reader can act on. Say plainly when something is uncertain or may be out of date.`,
      prompt: data.query,
    }),
  );
