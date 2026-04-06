# 2FA — React + Supabase Auth

A frontend-only authentication app built with **React 19 + Vite** and **Supabase Auth**.  
No backend required — all auth is handled by Supabase.

## Features

| Feature | Detail |
|---|---|
| OAuth sign-in | Google and GitHub via `supabase.auth.signInWithOAuth` |
| Persistent JWT sessions | Stored in `localStorage` and auto-refreshed |
| Protected dashboard | Redirect unauthenticated users to `/#/login` |
| Sign out | Clears JWT from browser and Supabase server |
| Responsive design | Mobile-first CSS, no extra UI library needed |

---

## Project structure

```
src/
├── supabase.js            # Supabase client (hard-coded credentials)
├── App.jsx                # Router + session state + route guards
├── index.css              # Global styles
└── components/
    ├── Login.jsx          # OAuth login (Google + GitHub)
    └── Dashboard.jsx      # Protected page showing user info
supabase/
├── config.toml
└── migrations/
    └── 20260406000000_init.sql
.github/
└── workflows/
    └── deploy.yml         # Build + deploy to GitHub Pages on push to main
```

---

## Supabase setup

### 1 — Enable OAuth providers

In your Supabase project → **Authentication → Providers**, enable **Google** and/or **GitHub** and paste in your OAuth app credentials.

### 2 — Add redirect URL

In **Authentication → URL Configuration → Redirect URLs**, add:

```
https://<your-github-username>.github.io/2fa/
```

---

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:5173/2fa/>.

---

## Deploy to GitHub Pages

Deployment is automatic via GitHub Actions on every push to `main`.

### One-time setup

1. Go to your repository → **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` — the workflow builds the app and deploys `dist/` to GitHub Pages.

The live site will be at:

```
https://<your-github-username>.github.io/2fa/
```

---

## License

MIT
