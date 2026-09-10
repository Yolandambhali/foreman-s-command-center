# Foreman's Command Center

Build "Foreman", an AI workplace productivity assistant styled around a job-site foreman handling paperwork, scheduling, and notes.

Key features:
1. Workbench (Dashboard): Overview hub introducing the crew's tools with quick access.
2. Correspondence (Smart Email Generator): Input for what the email needs to say and tone selector (formal, friendly, persuasive, apologetic, direct). Generates a subject line and editable body with one-click copy.
3. Site Notes (Meeting Notes Summarizer): Paste raw notes or transcript. Generates structured output with Summary, Decisions, and Action Items (with owner/deadline if mentioned), editable before copying.
4. Schedule (AI Task Planner / Scheduler): Input tasks with deadlines and select "day" or "week" view. Generates a prioritized schedule with brief reasoning for the sequence, editable before copying.
5. Research (AI Research Assistant): Enter topic, question, or text. Generates plain-language summary, 3-5 bulleted key points, and a practical recommendation, editable before copying.

Requirements:
- Persistent dark charcoal sidebar with numbered nav items (01 Correspondence, 02 Site Notes, 03 Schedule, 04 Research) plus Workbench overview, collapsible/responsive on mobile.
- Visible, context-tailored "Responsible AI" disclaimer on each tool page (e.g., verifying facts before sending, verifying deadlines, checking time-sensitive research).
- Aesthetic: Workshop/job-site feel — warm paper/ivory background, dark charcoal sidebar, brass/amber accent used sparingly, serif display headings (e.g. Fraunces), clean sans-serif body (e.g. IBM Plex Sans). Clean, minimal decoration, letting whitespace and typography lead.
- Powered by Lovable AI edge functions with structured prompts for each of the four tools.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7447aef6-5c86-41c8-9e38-24b3e295a17d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
