# Enchanted Stables Registry — Claude Code Workshop (Frontend Track)

A deliberately half-finished React + TypeScript horse-registry web app used in the Anthony Nolan Claude Code workshop, Day 4 (Frontend track). Over a ~4-hour hands-on lab you'll explore the code, extend it, fix a planted bug, build a reusable Claude Code toolkit, and connect it to a live backend — all by driving Claude Code yourself.

## Getting started

**Fork this repo first**, then clone your fork and work on a feature branch:

```bash
git clone https://github.com/<your-username>/claudeworkshop-day_4_demo_fe.git
cd claudeworkshop-day_4_demo_fe
git switch -c nova-none-stables-workshop

cd frontend
npm install
npm run dev      # http://localhost:5173
```

## The exercise

The full lab is in **[EXERCISE.md](EXERCISE.md)** — start there.

## Prototyping with Claude

**[PROTOTYPING.md](PROTOTYPING.md)** is a companion module on turning ideas into working prototypes with Claude — from a quick clickable render in claude.ai to real, runnable code in this repo. It walks through prototyping from a screenshot, building new pages and features as code, generating SVG wireframes, driving code toward a target mockup, troubleshooting, and shipping via PR or a live deploy.

## Layout

- `frontend/` — the React + TypeScript app (components / hooks / services)
- `backend/` — lightweight local API stub for offline development
- `.claude/` — shared Claude Code settings (hooks) and code style

## Licence

See [LICENSE.md](LICENSE.md).
