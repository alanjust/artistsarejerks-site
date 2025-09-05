# Hugo Context Kit for Cursor (Artists Are Jerks)

A lightweight set of **Rules, Facts, Rubrics, and Prompts** you can drop into Cursor so the model has the *right* context without wasting tokens.

---

## Quick Start (3 steps)
1. **Pin chats**: Auto (general), Claude/BYOK (refactors), GPT‑4o/BYOK (debugging).  
2. **Paste “Global Rules”** (below) into Cursor → Settings → Rules → *Project*.  
3. For each task, create a **Working Set Card** (template below), paste it at the top of the chat, and attach only the files/snippets involved.

---

## 1) Global Rules (paste into Project Rules)
```
HUGO CONTEXT RULES
- Plan-then-act: propose a 3–5 step plan; wait for my OK before code.
- Output unified diffs with explicit file paths for every change.
- Respect file boundaries I name; don’t touch others without approval.
- Prefer minimal, incremental patches; call out possible side effects.
- Ask before inventing Hugo variables/functions; cite the file/line you rely on.
- Keep tokens lean: consider ONLY the Working Set I provide unless I say otherwise.
- When uncertain, stop and ask for the exact file/lines you need.
- Use American English spelling and style.
```
*(You can also paste a shorter version into each pinned chat to reinforce behavior.)*

---

## 2) Project Facts (stable, reusable)
Paste once at the start of a project chat or keep in your Project Rules. Update when things change.

```
PROJECT: Artists Are Jerks (Hugo + Cloudflare)
GOALS: Clean, fast static site; simple styling; token-efficient collaboration in Cursor.
STACK: Hugo; local dev at http://localhost:1313/; deploy to Cloudflare.
STYLES: Single global CSS file preferred; desktop+mobile in one file for simplicity.
FONTS: Raleway and Jost.
HEADER: Gradient header; custom nav buttons; responsive hamburger menu.
LAYOUT: Using layouts/_default/baseof.html. Moving inline <style> into external CSS.
PREFERENCES: American English; incremental diffs; avoid “whole-repo” edits.
PREVIEW: Use `hugo server -D --disableFastRender --bind 127.0.0.1 --baseURL http://localhost:1313/` and point Cursor Preview to http://localhost:1313/.
```
> Keep this section short and stable. It acts like a spec the model can rely on.

---

## 3) Rubrics / Acceptance Criteria (copy as needed)

**A. Template/Partial change acceptance**
- Explains what changed and why in 3–5 sentences.
- No breaking changes to URLs, front matter, or existing shortcodes.
- Diffs only the files listed in the Working Set.
- Builds cleanly; preview shows expected elements in header/footer.

**B. CSS change acceptance**
- Behavior preserved on desktop and mobile.
- Specificity is not increased unless necessary; no !important unless justified.
- No unused selectors; no large framework added.
- File size growth justified; consider consolidation when adding >40 lines.

**C. Nav/menu interaction acceptance**
- Menu toggles with keyboard and click; focus trap doesn’t block page nav.
- State resets on route change; no scrolling lock after close.
- ARIA attributes present for button/state if JS used.

**D. Performance/bloat guardrails**
- Avoid adding dependencies unless essential.
- If a partial or CSS section grows by > ~80 lines, propose a split/cleanup plan.
- Summarize any added assets (names, sizes, purpose).

Paste the relevant rubric under your Working Set to make expectations explicit.

---

## 4) Working Set Card (use this per task)
Copy, fill in, and paste at the top of a chat.

```
WORKING SET (Hugo)
Goal: [one sentence goal]
Files in scope: [exact paths]
Out of scope: [paths to avoid]
Constraints: [any special constraints]
Acceptance: [paste one of the rubrics above or customize]
Notes: [links, screenshots, snippets]
```
> After the plan is approved, attach only the snippets/files named here.

---

## 5) Prompt Library (ready to paste)

**Plan‑then‑act preface (use at the start of a task)**
“First propose a 3–5 step plan based on my Working Set. Wait for my OK. Then implement step 1 only, outputting unified diffs for changed files.”

**Move inline CSS out of `baseof.html`**
“Working Set: `layouts/_default/baseof.html`, `assets/css/site.css`.  
Goal: Remove the inline `<style>` block and move all rules to `assets/css/site.css`. Use Hugo Pipes for minify+fingerprint and link the hashed CSS. Maintain visual behavior.  
Acceptance: CSS change acceptance + performance guardrails.  
Act only after plan. Output diffs for `baseof.html` and full content of new/updated CSS.”

**Create a `nav.html` partial and include it**
“Working Set: `layouts/_default/baseof.html`, `layouts/partials/nav.html`, `assets/css/site.css`.  
Goal: Extract header/nav into `layouts/partials/nav.html` with the existing classes and a mobile hamburger menu. Include the partial after `<body>` with `{{ partial "nav.html" . }}`.  
Acceptance: Template change + nav/menu interaction rubrics.  
Act only after plan. Output diffs for the two template files and CSS changes.”

**Homepage: list latest posts**
“Working Set: `layouts/index.html`.  
Goal: List the 6 most recent `.Site.RegularPages` (exclude `about`). Show title (link), date, summary, and a ‘More posts’ link to `/posts/`.  
Acceptance: Template change rubric.  
Act only after plan. Output a single-file diff.”

**Button shortcode**
“Working Set: `layouts/shortcodes/btn.html`, `assets/css/site.css`.  
Goal: Add a shortcode `btn` with params `href`, `variant` (primary|secondary), and inner content. Provide minimal CSS. Include a Markdown usage example.  
Acceptance: Template change + CSS change rubrics.  
Act only after plan. Output the new file and CSS patch.”

**Token‑lean bug hunt (menu doesn’t close on route change)**
“Working Set: `layouts/partials/nav.html` lines 1–120 and `assets/css/site.css` lines 1–200 only.  
Goal: Fix menu state so it closes on route change.  
Acceptance: Nav/menu interaction rubric.  
Act only after plan. Explain cause, then provide the minimal diff.”

**Config tweaks**
“Working Set: `config.toml` (or `config.yaml`).  
Goal: Set `baseURL = "https://example.com/"`, `paginate = 10`, and `disableKinds = ["taxonomy", "term"]`.  
Acceptance: Template change rubric (no breaking URLs).  
Act only after plan. Output a single-file diff.”

---

## 6) Token/KV Hygiene (keep context tight)
- Start a new chat when the topic changes.
- Paste the **Working Set Card** and only attach the relevant file snippets.
- Ask for **plan → approve → step‑by‑step patches**.
- Prefer **diffs** over full files. Request summaries before large edits.
- If the model starts pulling in unrelated files, restate: “Consider only the Working Set.”

---

## 7) Model picker guide (fast routing)
- **Auto**: general Q&A, light edits.  
- **Claude (BYOK)**: bigger refactors, long reasoning, template restructuring.  
- **GPT‑4o (BYOK)**: stepwise debugging, CSS/JS/DOM issues, log reasoning.  
- **Gemini (BYOK)**: long context or bulk content operations.

If you hit a cap, switch to a pinned BYOK chat or Auto.

---

You now have a compact context system: **Rules (stable)** + **Facts (stable)** + **Working Set (per task)** + **Rubric (per task)** + **Focused prompt**. Paste, run, iterate.
