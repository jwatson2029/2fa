# 2FA — React + Supabase Auth

A frontend-only authentication app built with **React 19 + Vite** and **Supabase Auth**.  
No backend required — all auth is handled by Supabase.

## Features

| Feature | Detail |
|---|---|
| Email / password sign-up & sign-in | `supabase.auth.signUp` / `signInWithPassword` |
| Persistent JWT sessions | Stored in `localStorage` and auto-refreshed |
| Protected dashboard | Redirect unauthenticated users to `/login` |
| Sign out | Clears JWT from browser and Supabase server |
| Password reset | Magic-link email via `supabase.auth.resetPasswordForEmail` |
| Responsive design | Mobile-first CSS, no extra UI library needed |

---

## Project structure

```
src/
├── supabase.js            # Supabase client (hard-coded credentials)
├── App.jsx                # Router + session state + route guards
├── index.css              # Global styles
└── components/
    ├── Login.jsx          # Email/password login
    ├── Register.jsx       # Sign-up with validation
    ├── Dashboard.jsx      # Protected page showing user email
    └── ResetPassword.jsx  # Password-reset request form
supabase/
├── config.toml            # Supabase CLI config (project: qjvwjszfpuimpmagpzqy)
└── migrations/
    └── 20260406000000_init.sql   # profiles table, RLS policies, new-user trigger
```

---

## 1 — Supabase project

Project URL: `https://qjvwjszfpuimpmagpzqy.supabase.co`  
Credentials are already hard-coded in `src/supabase.js`.

---

## 2 — Run the SQL migration

The file `supabase/migrations/20260406000000_init.sql` creates:

* **`public.profiles`** — one row per user (id, email, provider, created_at)
* **RLS policies** — each user can only read/update their own profile
* **`on_auth_user_created` trigger** — auto-populates `profiles` on every sign-up

### Option A — Supabase SQL Editor (easiest)

1. Open <https://supabase.com/dashboard/project/qjvwjszfpuimpmagpzqy/sql>
2. Paste the contents of `supabase/migrations/20260406000000_init.sql`
3. Click **Run**

### Option B — Supabase CLI

```bash
# 1. Log in with your personal access token
#    (generate one at https://supabase.com/dashboard/account/tokens)
npx supabase login

# 2. Link to the project
npx supabase link --project-ref qjvwjszfpuimpmagpzqy

# 3. Push the migration
npx supabase db push
```

---

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://qjvwjszfpuimpmagpzqy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_TXwOY3NKr8xVGLzJGATrFA_1AV4ujQ5

# Public URL of your deployed app (for password-reset redirect links)
VITE_SITE_URL=https://<your-app>.vercel.app
```

`.env.local` matches `*.local` in `.gitignore` and will **never** be committed.

---

## 3 — Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

---

## 4 — Deploy to Vercel

1. Push this repository to GitHub.
2. Go to <https://vercel.com> → **Add New Project** → import the repo.
3. Framework preset: **Vite** (auto-detected).
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` → set to your Vercel deployment URL (e.g. `https://my-app.vercel.app`)
5. Click **Deploy**.

> Vite builds to `dist/` which Vercel serves as a static site automatically.

### Vercel `vercel.json` (SPA routing)

Create this file so that deep links (e.g. `/dashboard`) are routed to `index.html`:

```json
{
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }]
}
```

---

## 5 — How sessions work (JWT storage)

```
User signs in
    │
    ▼
supabase.auth.signInWithPassword
    │
    ▼
Supabase returns { access_token (JWT), refresh_token }
    │
    ▼
@supabase/supabase-js persists both tokens in localStorage
key: "sb-<project-ref>-auth-token"
    │
    ▼
On every page load the client library reads localStorage,
validates the JWT, and exchanges an expired token for a
fresh one using the refresh_token — transparently.
    │
    ▼
supabase.auth.onAuthStateChange() fires with the current
session, keeping React state (and routing) in sync.
```

To use `sessionStorage` instead (clears on tab close):

```js
createClient(url, key, { auth: { storage: window.sessionStorage } })
```

---

## License

MIT
