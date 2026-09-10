# Foreman — AI workplace assistant

A job-site-styled productivity app with four AI tools plus an overview hub.

## Look and feel

- Warm paper/ivory page background, dark charcoal sidebar, brass/amber accent used sparingly.
- Fraunces serif for headings, IBM Plex Sans for body text, loaded from Google Fonts.
- Minimal decoration: whitespace, rules, and typography do the work. Numbered nav labels like a job-site checklist.

## Pages

1. **Workbench** (home) — short intro plus four cards linking to the tools, each with a one-line "what it does".
2. **01 Correspondence** — box for what the email must say, tone picker (formal, friendly, persuasive, apologetic, direct). Returns a subject line and an editable body, each with a copy button.
3. **02 Site Notes** — paste raw notes or a transcript. Returns Summary, Decisions, and Action Items with owner and deadline when mentioned. All editable, copy-all button.
4. **03 Schedule** — add tasks with deadlines, pick Day or Week. Returns an ordered plan with a short reason for the sequence. Editable, copyable.
5. **04 Research** — enter a topic, question, or pasted text. Returns a plain-language summary, 3–5 key points, and a practical recommendation. Editable, copyable.

Each tool page carries its own visible "Responsible AI" note tailored to its risk (check facts before sending, confirm deadlines with the crew, verify time-sensitive research, etc.).

## Layout

Persistent dark sidebar with Workbench plus the four numbered items. On phones it collapses behind a menu button and slides in.

## AI

Each tool calls Lovable AI server-side with its own structured prompt and a fixed output shape, so results render into the right fields instead of a wall of text. Loading and error states are shown in the page, including a clear message if the workspace runs out of AI credits.

## Technical notes

- TanStack Start routes: `/` (Workbench), `/correspondence`, `/site-notes`, `/schedule`, `/research`, sharing a sidebar layout in the root route.
- One `createServerFn` per tool in `src/lib/foreman.functions.ts`, calling the Lovable AI Gateway with strict JSON output schemas; `LOVABLE_API_KEY` stays server-side.
- Design tokens (paper, charcoal, brass) added to `src/styles.css`; no hardcoded colors in components.
- Per-route `head()` metadata with unique titles and descriptions.
- No database needed — nothing is stored between visits.
