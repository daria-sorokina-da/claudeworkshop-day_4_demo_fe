# Hands-On Exercise — Harness Claude Code on a Real Frontend

**Track:** Frontend Engineers · **Duration:** ~4 hours (including a 15-minute break) · **Style:** You drive. Work individually or in pairs.

> 🍴 **Before anything else: [fork this repo](https://github.com/daria-sorokina-da/claudeworkshop-day_4_demo_fe)**, then clone your fork and work on a feature branch — full setup in Part 0.

---

## About this project

The **Enchanted Stables Staff Portal** is a deliberately half-finished full-stack web app used for this workshop. It consists of two apps that run side-by-side:

| App | Tech | Port | Purpose |
|---|---|---|---|
| `frontend/` | React 18 + Vite + TypeScript | 5173 | Staff portal SPA — events list, staff list, dashboard |
| `backend/` | Express 4 + TypeScript | 3001 | REST API with in-memory store; seeds 8 events and 10 staff on startup |

The frontend proxies all `/api` requests to the backend, so you only open one URL in the browser.

### Running the project

```bash
# 1 — Install dependencies (once per app)
cd backend && npm install
cd ../frontend && npm install

# 2 — Start the backend (keep this terminal open)
cd backend && npm run dev
# → API running at http://localhost:3001
# → Swagger UI at http://localhost:3001/swagger

# 3 — Start the frontend (open a second terminal)
cd frontend && npm run dev
# → App running at http://localhost:5173
```

Open **http://localhost:5173** in your browser. You'll see the Enchanted Stables portal with a dark sidebar and three routes: **Dashboard**, **Events**, and **Staff**. The events list loads from the backend — but they appear in the wrong order. That's the debugging exercise in Part 2.

### Opening in Claude Code

From the repo root, open Claude Code in one of three ways:

```bash
# Option A — CLI (recommended for this workshop)
claude

# Option B — VS Code extension
# Open the repo folder in VS Code, then click the Claude Code icon in the sidebar

# Option C — Desktop app
# Open claude.com/code, then File → Open Folder → select this repo
```

Claude Code reads `CLAUDE.md` automatically on every session start — it already knows the project layout, domain model, and code style before you type a single prompt.

### Running the tests

```bash
cd backend && npm test      # 8 integration tests (Supertest + Vitest)
cd frontend && npm test     # 9 component tests (Vitest + React Testing Library)
```

All 17 tests should pass on a fresh clone. If any fail, fix them before starting the lab.

---

## What you'll practice

This is a *do-it-yourself* lab, not a watch-the-facilitator demo. You'll take the half-finished **Enchanted Stables Staff Portal** from "I don't know this code" to "I shipped a feature, fixed a real bug, and built a reusable team toolkit that runs itself."

Every part maps back to the workshop theory:

| Part | Concepts practised |
|---|---|
| 0 — Setup | Setup check · essential commands · Git safety net |
| 1 — Onboard & harness | Prompting (precise) · Plan mode · `/init` · CLAUDE.md · `@import` · Permissions · Context management · Component diagram |
| 2 — Ship & debug | Agentic loop · Spec → test workflow · Atlassian Rovo MCP (ticket lifecycle) · Hooks · `/rewind` · Red-test debugging · Git workflow & PR description |
| 3 — Build a team toolkit | Skills · Slash commands · Hooks (Post + PreToolUse) |
| 4 — Orchestrate sub-agents | Sub-agents (sequential + parallel) · Model selection & cost |
| Optional extras | GitHub MCP · GitHub Actions CI · Headless mode · Accessibility deep-dive · Zod validation |

> **The mindset:** AI is an amplifier. A good decision delivered faster — or a bad one propagated across a dozen files before you notice. You stay in charge: you own *what to build*, *what trade-offs to accept*, and *what is safe to ship*. Claude materialises the intent; the quality of the intent is on you.

---

## Timeline

| Time | Part | Minutes |
|---|---|---|
| 10:30 | **Part 0** — Setup & ground rules | 10 |
| 10:40 | **Part 1** — Onboard and harness the repo | 55 |
| 11:35 | **Part 2** — Ship a feature, then fix a real bug | 75 |
| 12:50 | **Break** | 15 |
| 13:05 | **Part 3** — Build your team toolkit | 35 |
| 13:40 | **Part 4** — Orchestrate sub-agents to ship a feature | 25 |
| 14:05 | Wrap-up | 5 |
| 14:10 | **Optional extras** | remaining time |

---

## Part 0 — Setup & ground rules (10 min)

This is a standalone repo — **fork it, then work on your own fork** so your changes never touch the shared original.

1. Open **https://github.com/daria-sorokina-da/claudeworkshop-day_4_demo_fe** and click **Fork** (top-right).
2. Clone your fork and create a feature branch — per our [Git Standards](https://anthonynolan.atlassian.net/wiki/spaces/NPDWS/pages/532185178/Git+Standards), all work happens on a branch:

```bash
git clone https://github.com/<your-username>/claudeworkshop-day_4_demo_fe.git
cd claudeworkshop-day_4_demo_fe
git switch -c nova-none-stables-workshop     # feature branch: lowercase, card-first, hyphenated
```

3. Confirm both apps start and Claude Code is ready:

```bash
# Terminal 1 — backend
cd backend && npm install && npm run dev      # http://localhost:3001

# Terminal 2 — frontend
cd frontend && npm install && npm run dev     # http://localhost:5173

# Verify tests pass
cd backend && npm test     # 8 route tests
cd frontend && npm test    # 9 component tests

claude --version           # confirm CLI + auth
```

Open `http://localhost:5173`. You'll see the portal with a dark sidebar, three routes (Dashboard, Events, Staff), and events listed in the wrong order — that's the debugging exercise in Part 2.

If anything fails to start, fix it before moving on — raise your hand.

**Three rules of highest importance, pinned for the whole lab:**

- Never paste secrets or real patient/donor data into a prompt. Anything you put in context has left your environment, regardless of Claude's data policy.
- Never use `--dangerously-skip-permissions` on this repo.
- Always read the diff before you accept it. Confident-and-wrong is Claude's main failure mode.

**Use Git as you go — follow the [commit standard](https://anthonynolan.atlassian.net/wiki/spaces/NPDWS/pages/532185178/Git+Standards).** Commit at the end of each milestone. Every message is `type: CARD-ID: Description` — `type` is one of `feature` / `fix` / `review` / `chore` / `docs`, the card ID is capitalised (`NOVA-NONE` for this workshop), and the description is a short present-tense phrase. A clean working increment you can return to beats one giant commit at the end — and `git stash` / `git checkout .` is your undo button if a prompt goes sideways.

**Commands you'll lean on:** `/help` · `/plan` · `/rewind` · `/clear` · `/compact` · `/context` · `/usage` · `/init` · `/memory` · `Esc` (stop mid-run, keep context) · `Shift+Tab` (cycle approval modes).

**Mid-task side notes — `/btw`:** While Claude is working you can type `/btw <your note>` to inject a correction or preference without interrupting the task flow. Claude receives it as a message and adjusts — useful for small steers like *`/btw use .temp not temp`* without stopping and re-prompting from scratch.

---

## Part 1 — Onboard and harness the repo (55 min)

**Goal:** Go from cold start to a repo that hands every future session the right context automatically. You'll get oriented fast, use plan mode to look before you leap, then make that knowledge permanent in `CLAUDE.md`.

### 1.1 — Get oriented, then diagram it (10 min)

Open Claude Code (`claude`) in the repo. One precise prompt — task framing + constraints + output format — gets you a real mental model fast:

```
In 3 bullets: what this app does, how it's layered, and — tracing the
"events appear on screen" path from the browser to the API — what actually
fetches the data. Read CLAUDE.md and the code first. Don't change anything.
```

✅ **Acceptance:** Without you naming a single file, Claude crosses `EventsPage` → `EventList` → `useEvents` → `eventsApi` → `fetch('/api/events')` and reports that data comes from the local backend on port 3001 — something you couldn't have known without exploring. That's `Glob`/`Grep`-driven discovery, not you feeding it files.

Now turn that trace into a picture you can keep:

```
Create docs/events-data-flow.md with a Mermaid sequence diagram of the
events-on-screen path you just traced: browser → EventsPage → EventList →
useEvents → eventsApi → backend API → back to the component.
```

Open the file in a Markdown preview — the diagram renders. Architecture docs for free, straight from the code.

### 1.2 — Critique the code — no fixes yet (10 min)

```
Review EventList.tsx, useEvents.ts, Dashboard.tsx, and Sidebar.tsx and list
the quality issues you find. Don't change anything. For each issue give the
file, what's wrong, and what the correct behaviour should be per code-style.md.
```

✅ **Acceptance:** Claude finds the intentional issues — `EventList` uses inline styles, `key={index}`, renders event details itself instead of delegating to `EventCard`, and has no empty-state message; `useEvents` sorts by `spotsRegistered` instead of `date`; `Dashboard` jumps h1→h3 skipping h2; `Sidebar` has a button with no `aria-label`. **Keep this list — you'll fix them in Part 2.**

Now persist the findings so they survive a `/clear` or a teammate's fresh session:

```
Save these issues to a file .temp/known-issues.md
```

✅ **Acceptance:** `.temp/known-issues.md` exists with each issue listed by file, what's wrong, and the required fix. The `.temp/` folder is gitignored — it's your personal scratch space for the session, not committed. This is also a useful pattern for real work — a review session's output becomes a durable artefact you can carry across `/clear` boundaries.

### 1.3 — Plan mode: look before you leap (10 min)

Switch to plan mode and ask for a *plan only*:

```
/plan

I want to make this codebase easier for a new engineer to find their way
around. What should we add to CLAUDE.md? Just propose it — don't write
anything yet.
```

Steer the plan in plain language before approving (e.g. *"Just stick to architecture, component patterns, and test patterns — keep it short and factual."*). This separates **thinking from doing**.

> **Where do plan files go?** By default Claude saves them to `~/.claude/plans/` (global). You can redirect them to `.temp/` by adding `"plansDirectory": ".temp"` in `.claude/settings.json` — plans land next to your other session scratch files, gitignored and easy to find.

✅ **Acceptance:** You see and shape the intent *before* any file changes.

### 1.4 — Make context permanent in CLAUDE.md (15 min)

Open `CLAUDE.md` — notice line 3, `@import .claude/code-style.md` (team standards loaded every session, kept separate from project facts) and the `<!-- TODO -->` stub sections.

First see what `/init` does — it scans the codebase and proposes CLAUDE.md content:

```
/init
```

Review its proposal in the diff. **Keep the `@import` line and our section headings** (Architecture, Domain Model, Key Files, Test Patterns); accept the useful factual content and discard anything generic or wrong. If `/init` strays too far from the curated stub, run `/rewind` to undo its changes (conversation *and* file) and fill it deliberately instead:

```
Explore the project and fill in the Key Files and Test Patterns sections of
CLAUDE.md. Keep it factual — only write things you've actually confirmed by
reading the code. For Test Patterns, look at EventCard.test.tsx and capture
the Vitest + React Testing Library pattern and the it('does X when Y') naming.
```

Review the diff and correct anything imprecise. Then **prove it loads**:

```
/clear

What test name format does this project use, per our code style?
```

✅ **Acceptance:** After `/clear` wipes the conversation, Claude still answers `it('does X when Y')` — because `CLAUDE.md` (and its `@import`) reload automatically. You wrote it once; every future session and teammate benefits.

### 1.5 — Permissions are a hard rule, not advice (5 min)

This repo already denies edits to `frontend/dist/**` and `.env` files (see `.claude/settings.json`). Test it:

```
Add a comment line to frontend/.env.local.
```

✅ **Acceptance:** Claude is blocked by the `deny` rule — it never gets the chance, regardless of what you ask. Telling Claude "don't touch env files" in a prompt is advice; `deny` in settings is enforcement by the harness.

### 1.6 — Wire up a local MCP server (5 min)

MCP (Model Context Protocol) is how Claude connects to external tools. You've already seen *connectors* (OAuth-based, configured in claude.ai settings — you'll use the Atlassian one in Part 2.1). A **local MCP server** is the other flavour: a process that runs on your machine, configured in `.mcp.json` at the repo root.

Create `.mcp.json` now with the **Context7 MCP server** — an on-demand documentation engine that gives Claude access to up-to-date library docs for React, Vite, TypeScript, and anything else in your stack:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

Restart Claude Code (so it picks up the new config), then confirm it loaded:

```
/mcp
```

You should see `context7` listed as connected. Now put it to work on something you'll actually need in Part 2:

```
Using the context7 MCP, look up how React Testing Library's renderHook works
for testing custom hooks — specifically the renderHook + act + waitFor pattern
for async hooks. Summarise the pattern and the imports I'll need.
```

✅ **Acceptance:** `/mcp` shows `context7` connected, and Claude returns accurate guidance straight from the official docs — not from training data. You'll write custom hook tests in Part 2, so this is live, useful context.

> **Three MCP config patterns — at a glance:**
> | | Connector | Remote server | Local server |
> |---|---|---|---|
> | Example | Atlassian, GitHub | Microsoft Learn | Context7, Playwright |
> | Auth | OAuth via claude.ai | Usually none | Token / env var |
> | Config | claude.ai Settings | `"type": "http"` in `.mcp.json` | `"command"` + `"args"` in `.mcp.json` |
> | Runs where | Anthropic's cloud | Provider's cloud | Your machine |
>
> All three expose the same tool-call interface to Claude — the choice is purely about where the server runs and how auth is managed.

> **Context check:** Run `/usage`. If you're climbing past ~60%, `/compact` now while recall is still clean before starting Part 2.

> **Commit checkpoint:** `git add . && git commit -m "docs: NOVA-NONE: Document architecture and test patterns in CLAUDE.md"`

---

## Part 2 — Ship a feature, then fix a real bug (75 min)

**Goal:** Run the full agentic loop twice — once to *build* (spec → hook → component → tests → wire up), once to *debug* (inspect → red test → fix → green). The repo's PostToolUse hooks auto-lint on every `src` edit and auto-run tests on every test file edit, so verification is free.

### 2.1 — Plan the feature first (10 min)

> **Optional — start from the ticket (Atlassian Rovo MCP).** In real work the spec comes from a story, not a prompt. The Atlassian Rovo MCP is a **cloud connector** built into claude.ai — no `.mcp.json` or local server needed. If it's enabled on your account, it's available in every session automatically.
>
> **Install & connect (do this once before 2.1):**
>
> 1. Open **[claude.ai](https://claude.ai)** in a browser and sign in.
> 2. Click your profile avatar (bottom-left) → **Settings** → **Integrations**.
> 3. Find **Atlassian** in the list and click **Connect**. A browser pop-up will open for Atlassian OAuth — sign in with your Atlassian account and grant access.
> 4. Once the pop-up closes, the integration status should show **Connected**.
> 5. Back in Claude Code, restart the session so the connector is picked up, then run `/mcp` — you should see `claude_ai_Atlassian_Rovo` listed as connected.
>
> The facilitator will share a throwaway workshop Jira story (`NOVA-####`) with acceptance criteria. If you use a real ticket, put its number in your branch and commits (`feature: NOVA-1234: …`) instead of `NOVA-NONE`.
>
> ```
> Read Jira ticket NOVA-#### with the Atlassian Rovo MCP and summarise its
> acceptance criteria — we'll build against these.
> ```
>
> No Jira set up? Just use the spec in the prompt below.

```
/plan

I need a StaffList component that fetches from GET /api/staff and renders
each member's name, role, and events count. Walk me through the plan — list
every file you'll create or modify — before writing any code.
```

Approve once the plan is scoped and sensible.

### 2.2 — Build it (20 min)

Build the StaffList end-to-end — each sub-step is a focused prompt, a reviewable diff, and a commit before you move on.

#### 2.2.1 — Data layer

```
Add the data layer for StaffList:
- fetchStaff() in src/api/volunteersApi.ts — GET /api/staff, return StaffMember[]
- useStaff() hook in src/hooks/useStaff.ts — same shape as useEvents (loading,
  error, data state)
Don't touch any component files yet.
```

> **Commit checkpoint:** `git add . && git commit -m "feature: NOVA-NONE: Add fetchStaff and useStaff hook"`
> Then `/clear` to start fresh for the next layer.

#### 2.2.2 — Component layer

```
Add the StaffList component in src/components/StaffList/StaffList.tsx:
- Uses useStaff()
- Shows loading and error states
- Renders each member's name, role, and eventsCount
- Follows the same folder and export pattern as EventCard
The data layer (fetchStaff + useStaff) is already in place.
```

> **Commit checkpoint:** `git add . && git commit -m "feature: NOVA-NONE: Add StaffList component"`
> Then `/clear`.

#### 2.2.3 — Wire it up

```
Replace the placeholder in VolunteersPage.tsx with the new StaffList component.
```

Open the browser at `http://localhost:5173/staff` — you should see real staff names from the backend.

> **Commit checkpoint:** `git add . && git commit -m "feature: NOVA-NONE: Wire StaffList into VolunteersPage"`

Watch the **lint hook** fire after each `src` edit, and read each diff before accepting.

> **Try `/rewind`:** don't like an edit Claude just made? Run `/rewind` to roll back the last action — conversation *and* file changes — with no Git needed. Undo one step, then re-prompt it more precisely. (Git checkpoints are for milestones; `/rewind` is for in-the-moment undo.)

### 2.3 — Tests close the loop (10 min)

```
Add component tests for StaffList in src/components/StaffList/StaffList.test.tsx.
Cover: loading state, renders all names and roles, shows error, and empty-list
state. Use EventCard.test.tsx as the pattern.
```

✅ **Acceptance:** When the test file saves, the **PostToolUse test hook** runs `npm test` automatically. If anything is red, let Claude self-correct from the hook output — you don't switch to the terminal.

> **Commit checkpoint:** green tests = a working increment. `git add . && git commit -m "feature: NOVA-NONE: Add StaffList with data layer and tests"`

### 2.4 — Refactor the EventList issues, one at a time (15 min)

Open `.temp/known-issues.md` from Part 1.2 and fix the EventList issues **individually**, verifying each in the browser:

```
Earlier you found four issues in EventList.tsx. Fix them one at a time, and
after each fix verify the component still renders correctly.
1) Replace the inline <li> block with <EventCard event={event} />.
2) Replace key={index} with key={event.id} and explain why before fixing.
3) Add an empty-state message: "No upcoming events."
4) Replace all inline styles with CSS classes from App.css.
Then add a test: "shows 'No upcoming events.' when the list is empty."
```

✅ **Acceptance:** Each change is a visible diff in the browser. The lint hook catches any style regressions inline. Tests go green automatically via the hook.

> **Commit checkpoint:** `git add . && git commit -m "fix: NOVA-NONE: Refactor EventList to use EventCard, stable keys, empty state, CSS classes"`

### 2.5 — The debugging loop on a real bug (10 min)

There's a genuine sort bug. Surface it without telling Claude the answer:

```
Users report that events appear sorted by popularity (how many spots are
booked) rather than by date. Help me find the cause. Don't fix it yet —
show me the exact line where the spec and the code disagree.
```

Claude should trace to `useEvents.ts` and spot that the sort key is `b.spotsRegistered - a.spotsRegistered` (popularity, descending) instead of `a.date.localeCompare(b.date)` (chronological, ascending). Then:

```
Before fixing, write a failing test in src/hooks/useEvents.test.ts proving
that the first event returned is the one with the earliest date. Confirm it
fails.
```

```
Now fix the sort in useEvents so the test passes.
```

✅ **Acceptance:** The fix is `a.date.localeCompare(b.date)`; the red test goes green; all other tests still pass. Refresh the browser — events now appear chronologically. **Red first, then green** — the failing test is the proof of the bug.

> **Commit, then draft the PR — follow the [Git Standards](https://anthonynolan.atlassian.net/wiki/spaces/NPDWS/pages/532185178/Git+Standards):**
> ```
> Review my current git diff — flag anything accidental or any missing tests,
> but don't change any files. Then write a commit message in our format
> (type: CARD-ID: present-tense description; use NOVA-NONE here) and commit.
> ```
> Then draft the pull request you'd open against `main`:
> ```
> Draft a PR description for this branch with sections: Summary, What changed,
> How tested, Risks / follow-ups. Save it to .temp/pr-description.md.
> ```
> Push your branch and open the PR in GitHub using the description Claude just drafted:
> ```bash
> git push -u origin nova-none-stables-workshop
> gh pr create --title "feature: NOVA-NONE: Add StaffList, fix sort bug, refactor EventList" \
>   --body "$(cat .temp/pr-description.md)"
> ```

> **Review the PR with GitHub Copilot.** Once the PR is open, trigger a Copilot code review from the GitHub UI — open the PR, click **"Request review"**, and choose **Copilot** from the reviewer dropdown. Copilot will post inline comments on the diff within a few seconds.
>
> Now bring those comments back into Claude Code and fix them — close the loop without copy-pasting:
> ```
> Read the open review comments on my PR using the GitHub connector (or GitHub
> MCP). List each comment Copilot left, then fix the code it refers to — one
> commit per comment, message: fix: NOVA-NONE: <what you changed>. Don't push
> until I've reviewed the diffs.
> ```
> When all fixes look good, push and reply to each thread to mark it resolved:
> ```
> Push the fix commits, then reply to each Copilot review comment on the PR
> summarising the fix you made.
> ```
> ✅ **Acceptance:** Each Copilot comment maps to a local fix you read and approved, the commits are pushed, and the PR threads are resolved. The full loop — write → PR → AI review → fix → push — ran without leaving Claude Code.
>
> *Don't have GitHub MCP connected yet? See the GitHub connector setup in Optional extras — it takes under 5 minutes.*

> **Optional — close the ticket loop (Atlassian Rovo MCP).** If you read the spec from Jira in 2.1, now move the story along (use a throwaway ticket — these prompts actually change it):
> ```
> Transition NOVA-#### to "Ready for Review" using the Atlassian Rovo MCP.
> ```
> ```
> Add a comment to NOVA-#### summarising the implementation: the components
> added, hook pattern, tests, and a link to the PR.
> ```

### 2.6 — Generate the CI workflow (10 min)

Code that can't be verified automatically isn't done. Generate a GitHub Actions workflow using the Context7 MCP you wired up in 1.6 — so the syntax comes from the official docs, not from training-data guesses.

```
Using the context7 MCP, look up the GitHub Actions workflow syntax for
running npm lint and npm test in a Node.js project. Then create
.github/workflows/ci.yml that:
- triggers on push to main and on any pull request
- runs on ubuntu-latest with Node 20
- installs dependencies, lints, and tests both frontend and backend
  as separate steps
Use the YAML syntax exactly as the docs show it.
```

Review the generated YAML — confirm the action versions and steps match what the MCP returned, not what you'd expect from memory.

✅ **Acceptance:** `.github/workflows/ci.yml` exists with lint and test steps for both apps. In a real project you'd push this and the pipeline would trigger automatically on every PR.

> **Commit checkpoint:** `git add .github && git commit -m "chore: NOVA-NONE: Add GitHub Actions CI workflow for lint and test"`

---

## ☕ Break — 15 minutes

---

## Part 3 — Build your team toolkit (35 min)

**This is where you stop typing every prompt and make the *repo* carry your workflow** — a Skill, a slash command, and a hook: the shared "what lives in the repo" context every teammate inherits on clone. You'll put the toolkit to work in Part 4.

### 3.1 — Get a Skill: draft your own, then install one (15 min)

A Skill is on-demand context Claude loads *only when relevant* — more token-efficient than `CLAUDE.md`, which loads every session. You'll get one both ways.

**Draft your own from what you just did.** You built the StaffList by hand in Part 2 — codify that recipe so Claude repeats it. Have Claude write it for you:

```
You just helped me build StaffList. Capture the repeatable recipe as a skill
at .claude/skills/new-component.md: the order to scaffold a new data-fetching
feature (API wrapper → custom hook → component → wire up → tests), all
following our code-style.md. Keep it tight, and add a description line so it
auto-loads when I add a new component.
```

Review the draft and tighten anything vague. ✅ **Acceptance:** Ask *"How should I add a new data-fetching component here?"* and confirm it invokes the skill (or trigger `/new-component`). The guidance comes from the skill, not from you re-explaining it each time.

**Install a published one.** You don't have to write every skill — they install like packages. Add a marketplace and install one ([plugin docs](https://code.claude.com/docs/en/discover-plugins); Anthropic's catalogue is [anthropics/skills](https://github.com/anthropics/skills), with community marketplaces too):

```
/plugin marketplace add anthropics/skills
/plugin            # browse, then install one — e.g. pdf
```

Then put it to work — e.g. have the `pdf` skill turn the component inventory into a shareable reference:

```
Using the pdf skill, generate a one-page PDF component reference from the
frontend: components, their props, and the hooks they depend on.
```

✅ **Acceptance:** a published skill you didn't write is installed and produces something real. (Needs network; if the marketplace path differs, browse `/plugin`.)

### 3.2 — Author a slash command (10 min)

A slash command is a workflow *you* trigger deliberately. Rule of thumb: *if you run the same prompt twice, codify it.* Create `.claude/commands/our-review.md`:

```markdown
Review the current git diff against our team standards:
- Components stay thin; data fetching lives in hooks, not components
- No inline styles — CSS classes from App.css only
- No array index as React key — use a stable entity id
- Empty states handled for all list components
- Tests exist for new components and follow it('does X when Y') naming
- No secrets, no unrelated changes
- Commit messages follow our standard (type: CARD-ID: description)
Report issues as a checklist. Do not modify any files.
```

✅ **Acceptance:** `/our-review` runs your standardised review on demand.

### 3.3 — Add a verification hook (10 min)

The repo already auto-lints `src` edits and auto-runs tests on test file edits. You'll add two things to `.claude/settings.json`: a `deny` rule, and a new hook that type-checks the frontend after every source edit so a TypeScript error never sneaks past you.

**1. Add the deny rule.** Open `.claude/settings.json`. Inside the existing `"permissions": { "deny": [ ... ] }` array, add this line at the top (keep the comma):

```json
"Bash(git push *)",
```

**2. Add the type-check hook.** Inside the existing `"hooks": { "PostToolUse": [ ... ] }` array, paste this as a new object (add a comma after the previous `}` so the array stays valid):

```json
{
  "matcher": "Edit(frontend/src/.*\\.tsx?)",
  "hooks": [
    {
      "type": "command",
      "command": "cd frontend && npx tsc --noEmit 2>&1 | tail -10 || true"
    }
  ]
}
```

This runs `tsc --noEmit` after every frontend `src` edit — if your change has a type error, you see it immediately instead of three steps later.

**3. Test it.** Restart Claude Code (so it reloads settings), then ask Claude to make any small frontend edit and watch the type-check fire in the hook output. Then confirm the deny works:

```
Push the current branch to origin.
```

✅ **Acceptance:** The type-check hook runs after a source edit, and the `git push` request is blocked outright. You can explain the difference: a **permission** stops the action before it ever happens; a **hook** runs a check around it.

**Optional — block secrets *before* they're written (PreToolUse).** A `PostToolUse` hook runs *after* a change; a `PreToolUse` hook runs *before* and can veto it. Create `.claude/hooks/block-secrets.mjs`:

```js
const input = JSON.parse(await new Response(process.stdin).text());
const { content = "" } = input.tool_input ?? {};
const secretPatterns = [/AKIA[0-9A-Z]{16}/, /sk-[A-Za-z0-9]{20,}/, /-----BEGIN (RSA |EC )?PRIVATE KEY/];
if (secretPatterns.some((re) => re.test(content))) {
  console.error("Blocked: looks like a hard-coded secret — use environment variables instead.");
  process.exit(2); // exit 2 = block AND show this message to Claude
}
process.exit(0);
```

Add a `PreToolUse` block alongside the existing `PostToolUse` in `hooks`:

```json
"PreToolUse": [
  {
    "matcher": "Write|Edit",
    "hooks": [ { "type": "command", "command": "node .claude/hooks/block-secrets.mjs" } ]
  }
]
```

Test it: ask Claude to write a fake private key (`-----BEGIN RSA PRIVATE KEY-----`) into a source file. The hook blocks the write, and because exit code `2` feeds the message back, Claude self-corrects instead of just failing — exactly the data-leak guardrail from the theory session.

---

## Part 4 — Orchestrate sub-agents to ship a feature (25 min)

Now put the toolkit to work. You'll deliver a real feature through a team of sub-agents — **a Staff Registration form, end-to-end.**

```
I need to add a staff registration form to /staff:
- Backend: add Zod validation to POST /api/staff — name (min 2 chars),
  email (valid format), role (one of the STAFF_ROLES enum).
- Frontend StaffForm component above StaffList:
  - Controlled form: Name, Email, Role (select from GET /api/staff/roles)
  - Client-side validation with inline errors on blur
  - On valid submit: POST /api/staff, refresh the list, reset the form
  - Success banner and error message
- Tests: form renders, shows validation errors for invalid input,
  calls the API and resets on valid submit.
```

> **Pick the right model — and watch the spend.** This part mixes cheap repetitive work with harder reasoning, so use `/model` to switch: keep most work on Sonnet, reach for higher thinking effort (or Opus) on the multi-step orchestration, and note the `test-runner` agent below is pinned to Haiku because writing and running tests is high-volume and cheap. Run `/cost` whenever you want to see what the session has spent.

Sub-agents are independent work streams with their own context and scoped tools. Create three under `.claude/agents/`:

`.claude/agents/implementer.md`

```markdown
---
name: implementer
description: Implements a planned feature across API, hook, and component layers.
tools: Read, Edit, Write
---
You implement features following the new-component skill and code-style.md.
Make minimal, layered changes. Do not write tests — that is the test-runner's job.
```

`.claude/agents/test-runner.md`

```markdown
---
name: test-runner
description: Use PROACTIVELY after code changes to write and run tests and fix failures.
tools: Bash, Read, Edit, Write
model: claude-haiku-4-5
---
You are a test automation expert. Write Vitest + React Testing Library tests for
new components and hooks, run npm test, and fix failures while preserving test
intent. Report what was fixed.
```

`.claude/agents/reviewer.md`

```markdown
---
name: reviewer
description: Read-only reviewer. Checks a diff against team standards. Never edits.
tools: Read, Bash
---
Review changes against code-style.md. Output a checklist of issues. Do not modify files.
```

Now orchestrate them from the main session (orchestration lives in *your* prompt, not the agent files):

```
/plan

Add a Staff Registration form to /staff. The feature:
- Backend: Zod validation on POST /api/staff — name (min 2 chars), email
  (valid format), role (one of STAFF_ROLES).
- Frontend StaffForm component: controlled form with Name, Email, Role select
  (loaded from GET /api/staff/roles), client-side validation on blur, POST on
  submit, refresh StaffList, reset form, success banner and error message.
- Tests: form renders, validation errors for invalid input, API called and
  form reset on valid submit.

Plan the work first, then build it in this order:
- use the implementer agent for the backend validation, API wrapper,
  form component, and wiring;
- then the test-runner agent to write and run all tests;
- then the reviewer agent to check the final diff.
List the plan before touching anything.
```

✅ **Acceptance:** The form ships, all tests pass, and the reviewer returns a clean (or actionable) checklist. You used **sequential orchestration** — implementer → test-runner → reviewer — each with a scoped toolset.

**Now feel the difference — fan out in parallel.** Sequential is right when each step needs the previous one's output. When tasks are independent, run them at once. Launch three reviewers in parallel over the StaffForm changes, each on a different concern, then aggregate:

```
Review the StaffForm changes with three reviewer agents running in parallel,
each focused on one concern: (1) security (input sanitisation, validation),
(2) accessibility (ARIA, keyboard nav, error announcements), (3) naming and
code-style conventions. Run them concurrently, then merge their findings into
one prioritised checklist.
```

Three agents work at once, each in its own context window — far faster than one agent doing three passes, and the same pattern fans out *writes* too (one implementer per feature in a monorepo) whenever the tasks touch independent files.

> **Commit checkpoint:** capture both the toolkit and the feature it produced. `git add . && git commit -m "feature: NOVA-NONE: Add StaffForm with validation via skill/command/agent toolkit"`

---

## Wrap-up

You took an unfamiliar repo and, in one sitting: onboarded with precise prompting, made the context permanent, shipped a feature and fixed a real bug through the agentic loop, and built a self-running team toolkit that then shipped a second feature for you. The thing to take away: **the loop is the same whether the task took 30 seconds or 3 hours — you don't close it until it's green, and you stay in charge of every decision.**

Before you stop: commit any loose work on your `nova-none-stables-workshop` branch (`type: CARD-ID: Description`), run `/cost` to see what the whole session spent, and skim `git log --oneline` — that clean, milestone-by-milestone history is what a reviewer would see.

---

## Optional extras — if you have time

You've done the core. These are the high-ceiling add-ons — pick whatever appeals; none depends on the others.

### Action PR review comments with the GitHub connector — *needs setup*

MCP is "USB for AI tools": one standard, any tool. The real payoff is closing the review loop — your PR comes back with comments, and instead of copy-pasting each one, Claude reads them straight from GitHub and fixes them.

There are two ways to connect GitHub — **connector** (zero local setup, OAuth) or **local MCP server** (token-based, works offline). Start with the connector; fall back to the server if OAuth isn't available.

> **Setup needed before this step (facilitator):** a GitHub repo holding the Stables FE code with **an open PR that already carries a few review comments** (e.g. *"EventList uses key={index}"*, *"no empty-state in StaffList"*).

#### Option A — GitHub connector (recommended, no token needed)

The GitHub connector is a **cloud connector** built into claude.ai — no `.mcp.json` or local server needed. Once connected, it's available in every Claude Code session automatically.

**Install & connect (do this once):**

1. Open **[claude.ai](https://claude.ai)** in a browser and sign in.
2. Click your profile avatar (bottom-left) → **Settings** → **Integrations**.
3. Find **GitHub** in the list and click **Connect**. Sign in with your GitHub account and grant access.
4. Back in Claude Code, restart the session, then run `/mcp` — you should see `claude_ai_GitHub` listed as connected.

Then have Claude pull the review comments and address them:

```
Read the open review comments on PR #<number> in <owner>/<repo> using the
GitHub connector. List each comment, then fix the code it refers to — one
commit per comment, message format: fix: NOVA-NONE: <what you changed>.
Don't push; I'll review the diffs first.
```

Optionally, have Claude reply to each thread so the PR shows what was done:

```
Reply to each of those review comments on the PR summarising the fix you made.
```

✅ **Acceptance:** `/mcp` lists `claude_ai_GitHub`, Claude reads the actual PR comments, and each one maps to a local fix you reviewed.

#### Option B — local MCP server (token-based)

Each participant needs a **GitHub personal access token** (repo scope) exported as `GITHUB_TOKEN`. Tokens go in `~/.claude.json` or your shell env — never committed.

Add to `.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```

Restart Claude Code and use the same prompts as Option A.

> **Connector vs. local server — the key difference:** a connector authenticates via OAuth through claude.ai and needs no local config; a local MCP server runs as a process on your machine and needs a token in your environment. Both expose identical tool-call interfaces to Claude.

### Run a headless CI gate

Close the loop with **no human in it**. From a normal terminal:

```bash
claude -p "Run the full frontend test suite and summarise any failures." \
  --allowedTools Bash,Read --max-turns 5
echo "exit code: $?"
```

✅ **Acceptance:** Claude runs headless, prints a summary, and exits — `0` on pass, non-zero on failure. You **scoped `--allowedTools` to `Bash,Read`**: a read-only task needs no `Write`. Minimum surface = minimum blast radius — exactly how you'd wire Claude into a CI step.

### Deep-dive accessibility audit

Run a full accessibility pass in one prompt:

```
Review this application for accessibility issues. Check: keyboard navigation,
ARIA labels, heading hierarchy, colour contrast (WCAG AA), semantic HTML, and
focus management. List every issue with the file, element, and the WCAG
criterion it fails.
```

Then fix one class at a time — heading hierarchy, then ARIA, then contrast — and after each fix tab through the UI in the browser to confirm focus rings are visible and screen-reader text makes sense.

### And more, biggest first:

- **Add event filtering by category.** The backend already supports `GET /api/events?category=show`. Add a category filter dropdown above `EventList`, wire it to `useEvents(category)`, and confirm it updates the list without a page reload. Write a test: *"shows only events of the selected category."*
- **Try these prompting patterns on the repo and compare what each gives you:**
  - **Precise vs. vague** — run `Tell me about this app.`, then a tightly scoped version:
    ```
    In 3 bullets: what this SPA does, how it fetches data, and how it's tested.
    Read CLAUDE.md and the code first. Don't change anything.
    ```
  - **Few-shot** — show the format by example and Claude matches it:
    ```
    List the components in src/components. Use exactly this format, like the example:
    EventCard — displays a single event (title, date, location, category, spots)
    Now do the same for every other component.
    ```
  - **Chain-of-thought** — make it reason in numbered steps, no code:
    ```
    I'm thinking about adding a "bookmarks" feature — staff can star events.
    Reason it through step by step: Step 1 which layer owns the state and why;
    Step 2 what it depends on; Step 3 the component and hook needed;
    Step 4 your recommendation.
    ```
  - **XML tags** — separate instruction from output format so neither bleeds into the other:
    ```
    <instruction>
    Draft a one-paragraph summary of the Event domain model for a new engineer.
    Don't change any files.
    </instruction>
    <output>
    Plain prose, no more than 4 sentences.
    </output>
    ```
- **Write a `/release` command.** Create `.claude/commands/release.md` with:
  ```markdown
  Pre-release checklist — report pass/fail for each, don't change anything:
  - All frontend tests pass (run npm test)
  - No TypeScript errors (run npx tsc --noEmit)
  - No ESLint errors (run npm run lint)
  - No inline styles remain in src/components
  - CLAUDE.md is up to date with any new components or hooks
  ```
- **Add a `Stop` hook** that pings you when Claude finishes. In `.claude/settings.json`, add to `hooks`:
  ```json
  "Stop": [
    { "hooks": [ { "type": "command", "command": "echo \"Claude finished — review the diff before committing.\"" } ] }
  ]
  ```
- **Bundle your toolkit** (skill + command + hook + agents) into an installable plugin and have a partner install it on a fresh clone — the onboarding test: *"Orient me in this codebase and help me pick up the first ticket."*

---

## Sources

- Git branch naming, merge flow, and commit-message format: [Git Standards — New Platform Development (Confluence)](https://anthonynolan.atlassian.net/wiki/spaces/NPDWS/pages/532185178/Git+Standards)
- Installing published skills/plugins: [Discover and install prebuilt plugins — Claude Code docs](https://code.claude.com/docs/en/discover-plugins)
- Anthropic published skills catalogue: [anthropics/skills (GitHub)](https://github.com/anthropics/skills)
- Context7 MCP server (library documentation on demand): [Context7 MCP (GitHub)](https://github.com/upstash/context7)
