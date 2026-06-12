# VoteKSB — KSBSA Presidential Election 2026

A live voting site for the KSBSA presidential election, built with React + Vite + Tailwind + recharts, ready to deploy on Netlify.

## How it works

- The frontend (`src/App.jsx`) renders the election site: hero, candidates, voting modal, live activity feed, and an admin panel.
- **Shared data** (vote tallies, the activity feed, and whether voting is open/closed) is stored server-side using a Netlify Function (`netlify/functions/storage.js`) backed by **Netlify Blobs**. Every visitor sees the same live results.
- **Personal data** (whether *this browser* has already voted, and what it voted for) is stored in `localStorage`, so it stays private to that device/browser.

## Deploying to Netlify

### Option A — Drag and drop (easiest)

1. On your own computer (with internet access), unzip this project.
2. Open a terminal in the project folder and run:
   ```bash
   npm install
   npm run build
   ```
3. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the whole project **folder** (not just `dist`) onto the page.

   > Note: drag-and-drop deploys only upload the `dist` folder as static files — they do **not** run the Netlify Function. For the live shared voting/admin features to work, use Option B instead.

### Option B — Connect a Git repo (recommended — enables shared live results)

1. Push this project to a new GitHub (or GitLab/Bitbucket) repository.
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Pick your repo. Netlify will auto-detect the settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
4. Click **Deploy site**.
5. Once deployed, go to **Site configuration → Environment variables / Blobs** (or just visit the site) — Netlify Blobs works automatically for sites deployed on Netlify, no extra setup needed.
6. Netlify will give you a URL like `https://your-site-name.netlify.app`. That's the link you share with voters.

### Option C — Netlify CLI

```bash
npm install -g netlify-cli
npm install
netlify login
netlify init
netlify deploy --prod
```

## Customizing

All the election-specific settings are at the top of `src/App.jsx`:

- `ELECTION_TITLE`, `ELECTION_YEAR`, `PLATFORM_NAME`
- `VOTING_DURATION_HOURS` — how long voting stays open after the first visit
- `ADMIN_PASSCODE` — passcode for the admin panel (open voting/close voting, view tallies, reset data). **Change this before sharing the link**, since it's visible in the source code and isn't real security.
- `CANDIDATES` — names, slogans, colors, platform info for each candidate

## Resetting votes

Open the site and use the **Admin** link (in the header/footer), enter `ADMIN_PASSCODE`, and use the reset buttons. This clears the shared tallies/activity stored in Netlify Blobs.

## Local development

```bash
npm install
npm run dev
```

Note: the shared storage Netlify Function only works when running via `netlify dev` (not plain `vite dev`), since Netlify Blobs requires the Netlify runtime:

```bash
npm install -g netlify-cli
netlify dev
```
