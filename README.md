# Vicky Kumar — Portfolio Site

A single-page portfolio built with plain HTML/CSS/JS (no build step, no
framework) — designed to be free-hosted on **GitHub Pages**. It includes:

- A hero with a live, mouse-reactive seismograph animation
- A "Field Log" of your research and projects, each linking to a certificate/report
- A **Puzzle Corner** — a new math/logic puzzle every day, with a streak
  tracker (stored in the visitor's browser) so people have a reason to come
  back
- A certificates shelf and toolkit/skills/education sections pulled from your CV

Below is the complete path from "I have never used GitHub" to "my site is live."

---

## Part 1 — Create your GitHub account (skip if you have one)

1. Go to **https://github.com** and click **Sign up**.
2. Choose a username, email, and password, verify your email.
3. That's it — free forever for this use case.

---

## Part 2 — Create the repository

GitHub Pages publishes a free site at `https://YOUR_USERNAME.github.io` if
your repo is named **exactly** `YOUR_USERNAME.github.io`. (You *can* use any
repo name and still publish, just at `/repo-name/` instead of the root — the
steps below use the clean root-domain option.)

1. Click the **+** icon (top right) → **New repository**.
2. **Repository name:** `YOUR_USERNAME.github.io` — replace `YOUR_USERNAME`
   with your actual GitHub username, exactly, lowercase.
3. Set it to **Public**.
4. Do **not** check "Add a README" (we already have one).
5. Click **Create repository**.

---

## Part 3 — Upload the site files

You have two options — pick whichever feels easier.

### Option A — Upload via browser (no software needed)

1. Open your new repo page on GitHub.
2. Click **Add file → Upload files**.
3. Drag in everything from this project folder, **keeping the folder
   structure**:
   - `index.html`
   - `style.css`
   - `script.js`
   - `assets/certificates/` folder (with your PDFs inside, or the `README.md`
     placeholder for now)
4. Scroll down, click **Commit changes**.

> Browser upload sometimes flattens empty folders. If `assets/certificates`
> doesn't appear, create it manually: **Add file → Create new file**, type
> `assets/certificates/.gitkeep` as the filename (GitHub auto-creates the
> folders), then upload your PDFs into that folder afterward the same way.

### Option B — Upload via Git (recommended once you're comfortable)

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
cd YOUR_USERNAME.github.io
# copy index.html, style.css, script.js, and the assets/ folder in here
git add .
git commit -m "Initial portfolio site"
git push origin main
```

---

## Part 4 — Turn on GitHub Pages

If your repo is named `YOUR_USERNAME.github.io`, Pages is usually enabled
automatically at the root. To confirm or enable manually:

1. In your repo, go to **Settings → Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. **Branch:** `main`, folder `/ (root)` → **Save**.
4. Wait 1–2 minutes. Refresh the page — you'll see a green banner:
   *"Your site is live at https://YOUR_USERNAME.github.io"*.
5. Visit that URL. Your portfolio is now public and free, forever, with no
   server to maintain.

> If you used a different repo name (not `username.github.io`), your site
> will be at `https://YOUR_USERNAME.github.io/REPO_NAME/` instead — same
> steps, just a longer URL.

---

## Part 5 — Personalize before/after publishing

Open `index.html` in any text editor (VS Code, Notepad, etc.) and update:

1. **GitHub / LinkedIn links** — search for `YOUR_USERNAME` (appears twice)
   and replace with your real profile URLs.
2. **Certificates** — put your PDF files in `assets/certificates/` using the
   filenames listed in `assets/certificates/README.md`, or swap in external
   links (Google Drive etc.) — instructions are in that same file.
3. **Puzzle bank** — open `script.js`, find the `PUZZLES` array near the top
   of Part 4, and add/edit/remove puzzle objects. Each one needs a
   `category`, `question`, `answer` (compared case-insensitively, so keep it
   short and unambiguous), and `hint`. The site automatically rotates through
   them by date — no extra setup needed.
4. **Colors/fonts** — all design tokens live at the very top of `style.css`
   under `:root { ... }` if you want to adjust the palette.

After editing, just re-upload/commit the changed files the same way as
Part 3 — GitHub Pages redeploys automatically within a minute or two of any
push to `main`.

---

## Part 6 (optional) — Custom domain

If you later buy a domain (e.g. `vickykumar.com`):

1. In **Settings → Pages**, enter it under **Custom domain** and save.
2. At your domain registrar, add a `CNAME` record pointing to
   `YOUR_USERNAME.github.io`.
3. Wait for DNS to propagate (up to 24 hrs), then check "Enforce HTTPS" back
   in the Pages settings.

This step is entirely optional — `https://YOUR_USERNAME.github.io` works
great and costs nothing.

---

## How the "remember me" puzzle mechanic works

- Each calendar day maps deterministically to one puzzle from the `PUZZLES`
  array in `script.js` (same puzzle for every visitor that day — like
  Wordle).
- A visitor's streak and solved-days are stored in their own browser via
  `localStorage` — nothing is sent to a server, so it stays free and
  simple, but it also means the streak is per-device/per-browser, not
  account-wide.
- "Past puzzles ↓" reveals the last 5 days so a visitor who missed a day can
  still see what they missed.

## File structure

```
YOUR_USERNAME.github.io/
├── index.html
├── style.css
├── script.js
├── README.md                      ← this file
└── assets/
    └── certificates/
        ├── README.md               ← naming guide for your PDFs
        ├── crop-residue-certificate.pdf
        ├── supply-chain-project-report.pdf
        ├── seismic-source-parameters-report.pdf
        ├── seismic-calculator-project.pdf
        ├── sedimentology-fieldwork-report.pdf
        ├── iymc-2024-certificate.pdf
        ├── jee-main-scorecard.pdf
        └── iat-scorecard.pdf
```
