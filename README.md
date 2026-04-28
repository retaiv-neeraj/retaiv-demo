# Retaiv — interactive demo

A real local React app. Pixel-for-pixel identical to the static mockup, but with working sidebar navigation, a fake login, and editable code with hot reload.

## Run it

You need [Node.js](https://nodejs.org) (LTS, version 18 or newer). Then:

```bash
cd retaiv-app
npm install
npm run dev
```

Vite opens **http://localhost:3000** automatically. You'll see the login screen → enter any email + password → land on the Accounts dashboard.

## Edit it

Open the project folder in **Cursor** (`File → Open Folder → retaiv-app`).

- `src/tokens.js` — colors, type, spacing (change here, all screens update)
- `src/ui.jsx` — primitives: `Pill`, `Spark`, `Icon`, `ScoreBar`, `Kbd`
- `src/shell.jsx` — app chrome: `TopBar`, `SideBar`, `Shell`, `PageHead`, `Btn`, `Stat`, `Card`
- `src/screen-dashboard.jsx` — Accounts table
- `src/screen-account.jsx` — Single-account detail
- `src/screen-queue.jsx` — Priority queue
- `src/screen-churn.jsx` — Churn analytics
- `src/screen-expansion.jsx` — Expansion pipeline
- `src/App.jsx` — login + navigation wiring

Save any file → browser refreshes automatically. No build step.

## Add features with Cursor

Open the chat panel (`Cmd+L` / `Ctrl+L`) and ask Cursor things like:

- *"In `screen-dashboard.jsx`, make clicking a row navigate to the AccountDetailScreen. Use the NavContext from shell.jsx — call `useContext(NavContext).navigate('account')`."*
- *"Make the search input in `shell.jsx` actually filter the accounts table. Lift the query into App.jsx state."*
- *"In `screen-queue.jsx`, when I click 'Done' on a priority item, fade it out and remove it from the list."*
- *"Add a sort dropdown to the accounts table for ARR / Health / Churn risk."*

The codebase is small and well-organized — Cursor's AI handles changes well here.

## Deploy a public link (for client demos)

```bash
npm install -g vercel
vercel
```

Follow the prompts, sign up with GitHub, accept defaults. You'll get a URL like `retaiv-abc.vercel.app` in 30 seconds. Free.

## When you're ready for the real backend

This Vite project is the foundation for the MVP. To add a backend:

1. Sign up at [supabase.com](https://supabase.com) (free tier).
2. Create tables matching the data shape in `screen-dashboard.jsx` (the `ACCOUNTS` array shows the columns you need).
3. Replace hardcoded arrays with `supabase.from('accounts').select('*')` calls.
4. Replace the fake login in `App.jsx` with Supabase Auth.

Your design — every component, color, spacing — comes through unchanged.
