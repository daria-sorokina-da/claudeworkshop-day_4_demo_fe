# Prototyping with Claude — Workshop Exercises

The core technique: describe a feature flow, give Claude visual or code context, and get a clickable React prototype back — fast, with no Figma licence and no hand-written boilerplate.

There are two complementary ways to run this:

- **Quick render (claude.ai):** Claude's artifact renderer shows a clickable React prototype directly in chat — React with Tailwind, shadcn/ui, Lucide icons, and Recharts built in. Best for instant feedback in a single conversation. Exercise 1 uses this.
- **Code prototype (Claude Code):** ask Claude Code to build the prototype as real, runnable code in this repo, so you can `npm run dev` it, refine it against the actual types, and ship it. Exercises 2–6 and the optional exercises use this. Let Claude explore the repo and decide where things live — don't hand it file paths.

> **Note:** Claude Code (this CLI / IDE extension) does *not* render React artifacts inline — that's a claude.ai feature. In Claude Code, "see the prototype" means running it locally. Pick the mode that fits what you're doing.

---

## What you'll practice

This is a *do-it-yourself* lab, not a watch-the-facilitator demo. You'll take a rough idea for the **Enchanted Stables Staff Portal** from "no designs exist yet" to "I shipped a clickable prototype, turned it into real runnable code, and opened a PR for it."

Every exercise maps back to the workshop theory:

| Exercise | Concepts practised |
|---|---|
| 1 — Prototype from a screenshot | Prototyping from a visual · claude.ai quick render · mirroring an existing design system |
| 1b — Prototype from exported HTML | HTML as input for Claude · lifting exact style values from markup · faster visual fidelity |
| 2 — New page as real code | Repo exploration · learning visual style and data shape · HTML prototype as a standalone file |
| 3 — Wireframe mockup as SVG | Low-fidelity overlay sketching · claude.ai artifact for stakeholder sign-off · iterating by conversation |
| 4 — Add a feature as a prototype | Extending an existing page · multi-state flows · HTML prototype with interaction |
| 5 — Drive code toward a mockup | Prototype → real code handoff · Playwright testing · screenshot validation · implementation verification |
| 6 — Troubleshoot the prototype | Fast recovery · blank screens · build failures · type errors |
| Optional A–B | GitHub connector & PR flow · Azure Static Web App deploy |

> **The mindset:** AI is an amplifier. A rough idea becomes a clickable prototype in minutes — but a vague brief becomes a polished mock-up of the wrong thing just as fast. You stay in charge: you own *what to build*, *which flow matters*, and *what is good enough to ship*. Claude materialises the intent; the quality of the intent is on you.

---

## What to give Claude for best results

| Input | Why it helps |
|---|---|
| Screenshot of the existing app | Claude mirrors colours, spacing, and component patterns |
| User story / flow description | Grounds the prototype in real behaviour — describe what the user needs to do and why |
| List of screens / states needed | Prevents Claude guessing the scope |
| Design system name (if known) | e.g. "we use shadcn/ui" or "Tailwind + blue/white palette" |

### Prompt structure that works well (claude.ai quick render)

```
Here's a screenshot of our app [attach image].

I want to prototype [feature name]. The flow is:
1. User clicks [X] on the Events page
2. A modal / drawer / new screen appears showing [Y]
3. User can [action], which transitions to [Z state]

Build a clickable React prototype that matches our existing UI style.
Use mock data. Include all screens in a single component with useState for navigation.
```

### What a claude.ai artifact can and can't do

These limits apply to the **quick-render** mode (Exercise 1). A **code prototype** (Exercises 2+) runs in the real app, so most of the "can't" column — real API calls, persistence, storage — becomes possible.

| ✅ Can do | ❌ Can't do |
|---|---|
| Clickable state transitions | Real API calls |
| Forms with validation | Persist data across sessions |
| Animations (Tailwind transitions) | Browser storage (no localStorage in artifacts) |
| Responsive layout | Native mobile gestures |
| Charts and data viz (Recharts) | File uploads that actually process |

---

## Setup — install and run the app

Most exercises need the app running locally: Exercise 1 needs it on screen so you can screenshot it, and Exercises 2–6 need the repo open in Claude Code so it can explore and edit real code. Get it running once, up front.

### What you need installed

| Tool | Why | Install on Windows | Check |
|---|---|---|---|
| **Node.js 20+** (includes `npm`) | Runs both apps | [nodejs.org](https://nodejs.org/en/download) — download the **Windows Installer (.msi, LTS)** and run it, or `winget install OpenJS.NodeJS.LTS` | `node --version` |
| **Git** | Clone the repo, branch, open PRs | [git-scm.com/download/win](https://git-scm.com/download/win) — run the installer (accept the defaults), or `winget install Git.Git` | `git --version` |
| **Claude Code** | Drives the code prototypes | [Install guide](https://docs.claude.com/en/docs/claude-code/setup) — in PowerShell run `irm https://claude.ai/install.ps1 \| iex`, or `npm install -g @anthropic-ai/claude-code`. VS Code extension: [marketplace](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) | `claude --version` |

> **Windows tip:** `winget` ships with Windows 11 — it's the quickest way to install Node and Git. After any install, **open a fresh terminal** so the new commands are on your `PATH`, then run the checks above. The `npm` commands below work the same in PowerShell and Git Bash.

The app is a two-app monorepo that runs side-by-side — the frontend proxies `/api` to the backend, so you only open one URL in the browser:

| App | Tech | Port | Purpose |
|---|---|---|---|
| `frontend/` | React 18 + Vite + TypeScript | 5173 | Staff portal SPA — events list, staff list, dashboard |
| `backend/` | Express 4 + TypeScript | 3001 | REST API with in-memory store; seeds 8 events and 10 staff on startup |

### Install and run

```bash
# 1 — Install dependencies (once per app)
cd backend && npm install
cd ../frontend && npm install

# 2 — Start the backend (keep this terminal open)
cd backend && npm run dev
# → API running at http://localhost:3001

# 3 — Start the frontend (open a second terminal)
cd frontend && npm run dev
# → App running at http://localhost:5173
```

Open **http://localhost:5173** — you'll see the Enchanted Stables portal with a dark sidebar and three routes: **Dashboard**, **Events**, and **Staff**. That's the screenshot source for Exercise 1 and the live target for Exercises 2–6.

### Open it in Claude Code

For the code-prototype exercises (2+), open Claude Code from the repo root:

```bash
# Option A — CLI (recommended for this workshop)
claude

# Option B — VS Code extension
# Open the repo folder in VS Code, then click the Claude Code icon in the sidebar

# Option C — Desktop app
# Open claude.com/code, then File → Open Folder → select this repo
```

Claude Code reads `CLAUDE.md` automatically on session start — it already knows the project layout, domain model, and code style before you type a prompt.

> **Exercise 1 is the exception:** it uses the **claude.ai quick render** (the artifact renderer in chat) and needs no repo or local setup — just the running app on screen so you can take a screenshot. Everything from Exercise 2 on runs in Claude Code against this codebase.

### Optional: Connect integrations for issue trackers

The exercises above use written prompts — no integrations needed. If you want Claude to fetch requirements automatically from issue trackers, you can connect these (skip if not applicable):

**Jira — via Rovo connector (claude.ai):**

1. Open [claude.ai](https://claude.ai) and sign in.
2. Click the **Integrations** icon (plug icon, left sidebar) → **Add integration**.
3. Search for **Jira** and select the **Atlassian Rovo** connector.
4. Click **Connect** and sign in with your Atlassian account when prompted.
5. Grant the requested permissions — Claude can now read issues and projects from your Jira instance.

Once connected, pasting a Jira URL like `https://your-org.atlassian.net/browse/STABLE-42` into the chat is enough — Claude fetches the title, description, and acceptance criteria automatically.

**GitHub — connector (claude.ai):**

1. In the same **Integrations** panel, search for **GitHub**.
2. Click **Connect** → authorise the GitHub OAuth app.
3. Select which repositories to grant access to (at minimum: this workshop repo).

Claude can now read issues, inspect pull requests, and post PR comments through the connector. The `gh` CLI (if installed) is an alternative for the same actions inside Claude Code.

---

## 1 — Prototype from a screenshot

**Scenario:** You want to add an event registration flow to the Enchanted Stables portal, but no designs exist yet. You have access to the running app but no code.

**Setup:** This exercise uses the **claude.ai artifact renderer** — open **https://claude.ai** in your browser before you start (you'll need to be signed in). Then open the Enchanted Stables portal at `http://localhost:5173/events`. Take a screenshot of the Events page (any OS screenshot tool works — the result can be pasted or uploaded directly into claude.ai).

**Your task:**

1. Take a screenshot of the Events page.
2. Paste it into Claude with this prompt:

```
Here's a screenshot of our Enchanted Stables staff portal.

I want to prototype an event registration flow. The flow is:
1. Staff clicks a "Register" button on an event card
2. A modal appears showing event details and a simple registration form
   (attendee name, email, a "notes" textarea)
3. On submit, a success screen replaces the form with a confirmation message
   and a "Back to Events" link

Build a clickable React prototype that matches the visual style in the screenshot.
Use mock data for the events list. Keep all screens in one component with useState.
```

3. Click through the prototype. Check that the visual style (sidebar colour, card layout, typography) matches the screenshot.
4. Ask Claude to adjust one thing — for example: *"Add validation errors to the fields after a submit attempt in case the fields were invalid."*

**What to notice:** Claude reads the screenshot to pick up colour values, card shape, and font weight — the prototype should feel native rather than generic, even with no design spec.

---

## 1b — Prototype from exported HTML

**Scenario:** Same goal as Exercise 1 — a clickable prototype in claude.ai — but instead of a screenshot you give Claude the actual page HTML. Chrome can export any page as a single file that includes the rendered DOM and all inline styles. Claude reads the real colour values, class names, and structure directly rather than inferring them from pixels, so the prototype is a closer match with less iteration.

**Setup:** This exercise also uses the **claude.ai artifact renderer** — keep `http://localhost:5173/events` open in Chrome alongside `https://claude.ai`.

**Your task:**

1. In Chrome, open the Events page at `http://localhost:5173/events`.
2. Export it: **⋮ menu → Save and share → Save page as… → choose "Webpage, Single File" (`.mhtml`)** and save it anywhere convenient.
3. Upload the `.mhtml` file to claude.ai and send this prompt:

```
Here's the exported HTML of our Enchanted Stables staff portal Events page.

I want to prototype an event registration flow. The flow is:
1. Staff clicks a "Register" button on an event card
2. A modal appears showing event details and a simple registration form
   (attendee name, email, a "notes" textarea)
3. On submit, a success screen replaces the form with a confirmation message
   and a "Back to Events" link

Build a clickable React prototype that matches the visual style from the HTML
exactly — reuse the same colour values, spacing, card shape, and typography
you can see in the markup. Use mock data for the events list.
Keep all screens in one component with useState.
```

4. Click through the prototype and compare it side-by-side with the real app.
5. Ask Claude to adjust one thing — for example: *"The modal overlay should be darker — match the exact background colour used in the sidebar."*

**What to notice:** with real HTML as input Claude can lift exact hex values, padding sizes, and class names directly from the source — you spend less time correcting the visual match and more time on the interaction flow.

---

## 2 — New page as real code

**Scenario:** You want to prototype a new page quickly — as a self-contained HTML+CSS+JS file you can open in any browser without starting the dev server. Claude explores the real codebase to learn the app's visual language (colours, card shapes, typography, sidebar layout), then reproduces it faithfully in a single standalone file. No React build step, no app changes.

**Setup:** Repo open in Claude Code. The app can be running or stopped — it doesn't matter, because the prototype lives in `prototypes/` and is never wired into the real app. Don't point Claude at specific files — let it explore.

**Your task:**

1. Describe the feature you want and let Claude build a standalone prototype:

```
I want a clickable HTML prototype for a new Attendees page showing all staff
members who have registered for upcoming events. The flow is:
- Page lists registered attendees with their name, email, role
- A filter lets you sort by event or date range
- Clicking an attendee shows a detail panel with their contact info and
  events they're attending

First, explore the repo to learn the visual style — colours, card layout,
sidebar structure, typography, spacing. Then build a single self-contained
HTML file (inline CSS and vanilla JS, no build step, no external dependencies
except CDN links if needed) that looks and feels like the real app.
Use realistic mock data. Save it to prototypes/attendees.html and tell
me the path. Do NOT touch any files in frontend/ or backend/.
```

Claude reads the real CSS to extract the colour variables and layout — so the prototype mirrors the actual app, not a generic design.

2. Open `prototypes/<feature-name>.html` directly in your browser (double-click the file). Click through the prototype and check it matches the app's look.
3. If something looks off, describe the difference (*"the sidebar background is lighter than the real app"*) and let Claude fix the HTML file in place.

**What to notice:** Claude reads the real CSS variables and layout patterns before writing a single line of HTML — the prototype should feel native to the app rather than generic. And because it's a plain HTML file in `prototypes/` (gitignored), it never pollutes the codebase or breaks the build.

---

## 3 — Wireframe mockup as SVG

**Scenario:** You want to sketch an overlay (a confirmation dialog, a registration drawer, a detail panel) before writing any code. You give Claude a screenshot of the existing page so it can trace the layout, then ask for a low-fidelity wireframe of the overlay rendered on top of it — boxes and labels only, no colour. The result is a shareable SVG artifact you can paste into a ticket or PR for stakeholder sign-off.

**Why SVG in claude.ai:** the artifact renderer displays the SVG inline so you can review and iterate without downloading a file. Keeping it black-and-white wireframe (not a polished render) keeps the review about layout and structure, not pixels.

**Setup:** This exercise uses the **claude.ai artifact renderer** — open **https://claude.ai** and sign in. Open the Enchanted Stables portal at `http://localhost:5173/staff` and take a screenshot.

**Your task:**

1. Paste the screenshot into claude.ai with this prompt:

```
Here's a screenshot of our Enchanted Stables staff portal Staff page.

Create a low-fidelity wireframe SVG showing this page with a "Staff member
profile" modal overlaid in the centre. The modal should contain:
- A header with the staff member's name, their role badge, and a close (×) button
- Contact info: email address
- A "Member since" date and an "Events attended" count
- A scrollable list of 3–4 recent events they attended (event title + date)
- A "Deactivate member" danger button at the bottom

Wireframe style only: black outlines, grey fills for content areas, plain text
labels — no colour, no icons, no shadows. Keep the Staff page visible but
dimmed behind a semi-transparent overlay. Render as a single inline SVG with
a fixed viewBox.
```

2. Review the wireframe in the artifact panel. Check the modal proportions and the event list layout.
3. Iterate in plain language — Claude updates the SVG in the same artifact: *"add an 'Edit role' dropdown above the deactivate button"*, *"make the modal taller to show more events"*, *"add a section divider between contact info and the events list"*.
4. Once it's right, this SVG becomes the target for Exercise 5.

**What to notice:** the screenshot gives Claude the real page layout to place the overlay against — the wireframe shows the overlay *in context*, not floating in a void. Staying low-fidelity keeps the conversation about structure; stakeholders comment on what's missing rather than arguing about colours.

---

## 4 — Add a feature as a prototype

**Scenario:** Rather than a new page, you want to extend an existing one — adding an interaction flow to the Events page. You don't want to touch the real codebase yet; instead Claude explores the repo to learn the visual style, then builds a standalone HTML prototype of the Events page with the new feature layered on top.

**Setup:** Repo open in Claude Code. The app can be running or stopped — the prototype lives in `prototypes/` and is never wired into the real app. Don't point Claude at specific files — let it explore.

**Your task:**

1. Ask Claude to build the bulk-actions flow as a standalone prototype, reading the repo for visual style:

```
I want a clickable HTML prototype of the Events page with a bulk-actions flow
added. The flow is:
1. The Events page gains a "Select" mode toggle in the header
2. In Select mode, each event card shows a checkbox
3. A floating action bar appears at the bottom when ≥1 event is selected,
   showing "X events selected", a "Cancel" button, and a "Deactivate" button
4. Clicking "Deactivate" shows a confirmation dialog, then a success toast

First, explore the repo to learn the visual style — colours, card layout,
sidebar structure, typography, spacing, and the real event data shape
(field names like isActive, spotsTotal, spotsRegistered). Then build a single
self-contained HTML file (inline CSS and vanilla JS, no build step) that looks
and feels like the real app, with realistic mock event data.
Save it to prototypes/bulk-actions.html. Do NOT touch any files in
frontend/ or backend/.
```

2. Open `prototypes/bulk-actions.html` in your browser and click through the flow.
3. Ask for a follow-on state: *"After deactivation, show the events list with the deactivated cards greyed out."*

**What to notice:** Claude reads the real field names and CSS from the repo before writing a line of HTML — the mock data uses the actual shape (`isActive`, `spotsTotal`, etc.) and the styling mirrors the real app, without any code landing in the codebase.

---

## 5 — Drive code toward a mockup

**Scenario:** The clickable HTML prototype from Exercise 4 has been approved — stakeholders clicked through the bulk-actions flow and signed off on it. Now you want to bring that interaction into the real app: Claude reads both the prototype and the live codebase, then implements the feature as real React code that matches what the prototype shows.

**Setup:** Repo open in Claude Code, app running locally. The prototype file `prototypes/bulk-actions.html` from Exercise 4 is your target spec.

**Your task:**

1. Hand Claude the prototype file and let it read the current app itself:

```
Here's an approved clickable prototype for a bulk-actions flow on the Events
page [attach prototypes/bulk-actions.html].

Explore the current app yourself to understand the existing components, types,
and styling — don't assume where things live. Then implement this flow as real
React code in the app, matching the interaction and layout shown in the
prototype and keeping our existing visual language (colours, card style,
typography). Use local state only — no backend writes yet. Run it so I can
click through it.
```

2. Open the running app and click through the bulk-actions flow. Compare it side-by-side with the prototype in your browser.
3. Where it drifts from the prototype, point at the specific detail: *"The action bar in the prototype is pinned to the bottom edge — it's floating too high in the real app."*
4. Once it looks right, ask Claude to write and run a Playwright test that covers the flow:

```
Write a Playwright test for the bulk-actions flow you just implemented.
The test should:
1. Open the Events page
2. Click the "Select" toggle and verify cards show checkboxes
3. Check two event cards and verify the action bar appears with the correct count
4. Click "Deactivate", confirm the dialog, and verify the success toast appears

After each step, take a Playwright screenshot and save it to
screenshots/ with a descriptive filename.

Use the existing test setup in this repo if there is one; otherwise scaffold
the minimum Playwright config needed. Run the test and show me the output.
```

**What to notice:** the prototype becomes the spec, and Claude reads both it and the live repo — so it interpolates rather than reinvents. The feature lands in the real component tree using the actual types and CSS variables, not a copy-paste of the prototype's inline styles. The Playwright test then locks in the behaviour so future changes can't silently break the flow.

---

## 6 — Troubleshoot the prototype

**Scenario:** Real code doesn't always work first try. Recovering quickly is part of the skill — a blank screen or a failed build shouldn't end the session.

**Your task:** Work through these common failure modes. For each, trigger it (or recognise it when it happens) and practise the recovery prompt.

| Symptom | Likely cause | Recovery prompt |
|---|---|---|
| Blank screen in the browser | Runtime error in a component | "The page is blank — check the browser console and dev-server output, find the error, and fix it." |
| Dev server won't start / build fails | TypeScript or import error | "`npm run dev` fails with [paste the error] — diagnose and fix it." |
| Type errors after the change | Wrong field names or data shape | "There are type errors — reconcile the new code with the real types; don't loosen them to `any`." |
| Styles look off | Didn't reuse the existing CSS variables | "The styling doesn't match — find and reuse the existing CSS variables instead of inline colours." |
| Change doesn't show up | Edited the wrong file, or stale reload | "My change isn't visible — confirm which file actually renders this and that the dev server reloaded." |
| View resets on every click | State recreated each render | "Clicking resets the view — the state isn't persisting; find where it's declared and fix it." |

**Try it:**

1. Ask Claude to rename a field on the event type and *not* update its usages — watch the build break, then use the "diagnose and fix it" prompt.
2. After a change, if the page goes blank, paste the browser console error and let Claude trace it back to the component.

**What to notice:** most failures are recovered with one targeted follow-up — you rarely need to start over. Naming the symptom precisely and pasting the actual error gets a faster fix than "it's broken."

---

## Optional exercises

Optional A ships your implemented code through your normal GitHub review flow; Optional B puts it on a live URL.

### Optional A — Store prototypes in a shared repository

**Scenario:** You've built a prototype (from any of Exercises 1–5, or quickly in claude.ai). Now you want to preserve it and share it with the dev team. Instead of keeping it local, store it in a dedicated prototypes repository on GitHub where it can be versioned, discussed, and linked from tickets.

**Setup:** You need Git and a GitHub account. The template repo is at [github.com/daria-sorokina-da/claudeworkshop-day_4_demo_fe_prototypes](https://github.com/daria-sorokina-da/claudeworkshop-day_4_demo_fe_prototypes).

**Your task:**

1. **Fork the template repo** — visit the link above and click **Fork** (top right). GitHub creates your own copy under your account.

2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/claudeworkshop-day_4_demo_fe_prototypes.git
   cd claudeworkshop-day_4_demo_fe_prototypes
   ```

3. **Add your prototype** — create a folder named after the feature, then save your HTML prototype there:
   ```
   bulk-actions/
   └── index.html          ← your standalone prototype
   ```

4. **Commit and push:**
   ```bash
   git add bulk-actions/
   git commit -m "Add bulk-actions prototype"
   git push
   ```

5. **Share the link** — give teammates the path in your fork: `https://github.com/YOUR-USERNAME/claudeworkshop-day_4_demo_fe_prototypes/blob/main/bulk-actions/index.html`. They can click "Raw" to open it directly in the browser.

**What to notice:** the prototypes repo is separate from the main codebase — it's a living gallery of approved designs that devs reference when implementing features. Each prototype is versioned in git, so you can link it from tickets and see its evolution over time.

### Optional B — Deploy all prototypes to Azure Static Web App

**Scenario:** Instead of deploying individual prototypes manually, build a unified prototype gallery at a live URL where every prototype is accessible at its own route. When you push a new prototype to GitHub, it deploys automatically.

**Setup — what you'll build:**

Your prototypes repository has a folder per feature with an `index.html` inside:
```
prototypes-repo/
├── index.html                    ← Gallery landing page
├── staticwebapp.config.json      ← Azure routing config
├── .github/workflows/
│   └── deploy.yml               ← GitHub Actions automation
├── bulk-actions/
│   └── index.html
├── schedule/
│   └── index.html
└── … (other prototypes)
```

The gallery landing page (`index.html`) lists all prototypes as clickable cards. Each time you push to GitHub, the workflow automatically deploys to Azure.

**Your task:**

#### 1. Fork and clone the prototypes repository

Visit [github.com/daria-sorokina-da/claudeworkshop-day_4_demo_fe_prototypes](https://github.com/daria-sorokina-da/claudeworkshop-day_4_demo_fe_prototypes) and click **Fork** (top right). Then:

```bash
git clone https://github.com/YOUR-USERNAME/claudeworkshop-day_4_demo_fe_prototypes.git
cd claudeworkshop-day_4_demo_fe_prototypes
```

#### 2. Create repository structure

Ask Claude Code to generate the files or create them manually. You need:

**Gallery landing page** — `index.html` in the repo root. This is an interactive gallery listing all prototypes as cards. Each card links to `./prototype-folder/index.html`. Include fields like title, description, category, status, and flow. See the template in the exercise files.

**Prototype folders** — create a folder for each prototype:
```bash
mkdir bulk-actions
# then save your prototype HTML as bulk-actions/index.html
```

**Azure routing config** — `staticwebapp.config.json` at repo root:
```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    },
    {
      "route": "/bulk-actions",
      "serve": "/bulk-actions/index.html"
    },
    {
      "route": "/bulk-actions/*",
      "serve": "/bulk-actions/index.html"
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

**GitHub Actions workflow** — `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Azure Static Web App

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true

      - name: Deploy to Azure Static Web App
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: ""
          skip_app_build: true

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request in Azure Static Web App
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

#### 3. Create a PR on GitHub

**Option A — Manual (GitHub web):**

```cmd
git checkout -b setup/azure-deployment
git add .
git commit -m "Add gallery, routing config, and deployment workflow"
git push origin setup/azure-deployment
```

Then on GitHub:
1. Open your fork and click **Pull requests** → **New pull request**
2. Set base to `main`, compare to `setup/azure-deployment`
3. Create the PR with title *"Setup: Add Azure deployment workflow"*
4. Review the changes, then click **Merge pull request** to merge to main

**Option B — Let Claude Code do it:**

Open Claude Code from the prototypes repo and send this prompt:

```
Create a feature branch, commit the gallery, routing config, and deployment
workflow files, push the branch, and open a pull request on GitHub.

Title the PR "Setup: Add Azure deployment workflow" and summarise what
changed (routing config, GitHub Actions workflow). Then merge the PR to main.
```

Claude will handle the git workflow and GitHub PR via the `gh` CLI.

Once merged to main, GitHub Actions triggers automatically and deploys to Azure.

> **⚠️ Important:** If Azure auto-generates a second workflow file (e.g., `azure-static-web-apps-*.yml`), **delete it and push the deletion**. The custom `deploy.yml` you created includes `skip_app_build: true`, which prevents Azure from trying to build—since your prototypes are static HTML only. Auto-generated workflows cause build failures looking for `package.json` or build scripts that don't exist in a static repo. To fix: remove the auto-generated file, commit, and push.

#### 4. Set up Azure Static Web App — Portal Steps

1. Open [portal.azure.com](https://portal.azure.com) and sign in with your Azure account (free tier is fine).

2. Click **Create a resource** → search **Static Web App** → click **Create**.

3. **Fill in the form:**
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new (e.g., `prototypes-rg`) or use existing
   - **Name**: e.g., `enchanted-stables-prototypes` (becomes part of your public URL)
   - **Plan type**: **Free**
   - **Region**: Choose closest to you (e.g., `East US`)
   - **Source**: **GitHub**

4. **Authorize GitHub:**
   - Click **Sign in with GitHub** and complete the OAuth flow.
   - Grant permissions when prompted.

5. **Select your repository:**
   - **Organization**: Your GitHub username
   - **Repository**: `claudeworkshop-day_4_demo_fe_prototypes`
   - **Branch**: `main`

6. **Build details:**
   - **Build Presets**: Leave blank (we're deploying static HTML only, no build needed)
   - **App location**: `/`
   - **API location**: Leave blank
   - **Output location**: Leave blank

7. Click **Review + create** → **Create**.

Azure will:
- Provision the Static Web App (~2 minutes)
- Automatically create a GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN` in your repo
- Trigger the first deployment

#### 5. Verify the GitHub secret was created

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**.
2. You should see `AZURE_STATIC_WEB_APPS_API_TOKEN` listed.
3. If it's missing, Azure will have shown an error — check the Azure Portal for deployment logs.

#### 6. Access your gallery

Once deployed (watch the Actions tab in GitHub for the workflow to complete):

- **Gallery home**: `https://<your-swa-name>.azurestaticapps.net/`
- **Bulk-actions**: `https://<your-swa-name>.azurestaticapps.net/bulk-actions`
- **Any prototype**: `https://<your-swa-name>.azurestaticapps.net/<folder-name>`

**Example:** if your resource name is `enchanted-stables-prototypes`, visit:
- `https://enchanted-stables-prototypes.azurestaticapps.net/`

#### 7. Add more prototypes

Every time you create a new prototype folder and push to GitHub:

1. Create a new folder: `mkdir my-new-feature`
2. Save your prototype: `my-new-feature/index.html`
3. Update `staticwebapp.config.json` with a route for the new prototype (copy the bulk-actions pattern)
4. Update the gallery (`index.html`) to include a card for the new prototype
5. Commit and push:
   ```bash
   git add .
   git commit -m "Add my-new-feature prototype"
   git push
   ```

GitHub Actions runs automatically. Your prototype is live in ~30 seconds.

**What to notice:** this is a permanent gallery, not a one-off deploy. Every time you push a new prototype to GitHub, it's live in seconds. Stakeholders bookmark the gallery URL and always see the latest versions. No manual copy/paste, no SWA CLI, no credentials to manage — just git push. Pull request previews are included automatically (Azure creates a staging environment for each PR).

---

## Tips for multi-screen flows

- Ask Claude to use a single `currentScreen` state variable to switch between views — keeps the component clean and shareable as a link.
- For complex flows, ask for a breadcrumb or stepper so stakeholders understand where they are in the flow.
- Request "realistic mock data" rather than placeholder text — *"Summer Show 2025, 12 spots remaining"* reads far better in stakeholder reviews than *"Event Title"*.
- For a presentation or demo, ask Claude to add a **Scenario selector** that walks through predefined user paths automatically.

---

## What this module teaches

| Exercise | Skill |
|---|---|
| 1 — Prototype from a screenshot | Prototyping from a visual · mirroring design systems · claude.ai quick render |
| 1b — Prototype from exported HTML | Using real markup as input for Claude · exact style value extraction · faster visual match |
| 2 — New page as real code | Repo exploration · learning visual style and data structure · building standalone HTML prototypes |
| 3 — Wireframe mockup as SVG | Low-fidelity overlay sketching · claude.ai for stakeholder sign-off · iterating by conversation |
| 4 — Add a feature as a prototype | Extending an existing page · multi-state flows · interactive HTML prototypes |
| 5 — Drive code toward a mockup | Prototype → real code handoff · Playwright testing · screenshot validation · implementation verification |
| 6 — Troubleshoot the prototype | Fast recovery · diagnosing blank screens, build failures, and type errors |
| Optional A — Store prototypes in GitHub | BA workflow · version control · feature-per-folder structure · sharing with dev teams |
| Optional B — Deploy with Azure SWA | CI/CD automation · GitHub Actions workflows · routing config for multi-prototype gallery · live deployment on push |
