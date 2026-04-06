# 2FA — React + Supabase Auth with Google SAML SSO

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
| **Google SAML SSO** | `supabase.auth.signInWithSSO({ domain })` |
| Responsive design | Mobile-first CSS, no extra UI library needed |

---

## Project structure

```
src/
├── supabase.js            # Supabase client (reads env vars)
├── App.jsx                # Router + session state + route guards
├── index.css              # Global styles
└── components/
    ├── Login.jsx          # Email/password login + Google SSO button
    ├── Register.jsx       # Sign-up with validation
    ├── Dashboard.jsx      # Protected page showing user email/provider
    └── ResetPassword.jsx  # Password-reset request form
```

---

## 1 — Set up a free Supabase project

1. Go to <https://supabase.com> and create a free account.
2. Click **New project**, choose a name and strong database password.
3. After the project initialises, open **Settings → API**.
4. Copy the **Project URL** and the **anon / public** key (labelled *publishable* in newer dashboards).

---

## 2 — Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://qjvwjszfpuimpmagpzqy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_TXwOY3NKr8xVGLzJGATrFA_1AV4ujQ5

# Public URL of your deployed app (for password-reset redirect links)
VITE_SITE_URL=https://<your-app>.vercel.app

# SAML SSO: email domain for your org (e.g. acme.com). Leave blank to hide the button.
VITE_SSO_DOMAIN=
```

`.env.local` matches `*.local` in `.gitignore` and will **never** be committed.

---

## 3 — Set up Google SAML SSO (Supabase Team/Enterprise)

> SAML SSO requires the **Supabase Team or Enterprise plan**.

### A. Register the IdP in Supabase

Supabase SSO configuration is done via the **Management API** (or the dashboard SSO tab on Team+ plans).

```bash
# Replace <access-token> with a token from https://supabase.com/dashboard/account/tokens
# Replace <project-ref> with your project reference (e.g. qjvwjszfpuimpmagpzqy)
curl -X POST \
  "https://api.supabase.com/v1/projects/<project-ref>/config/auth/sso/providers" \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "saml",
    "metadata_xml": "<paste the full IdP metadata XML below>",
    "domains": ["<your-org-domain.com>"]
  }'
```

**IdP Metadata XML** (from Google Admin → Apps → Web and mobile apps → your SAML app → Download metadata):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
  entityID="https://accounts.google.com/o/saml2?idpid=C01r32475"
  validUntil="2031-02-20T16:52:48.000Z">
  <md:IDPSSODescriptor WantAuthnRequestsSigned="false"
    protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIIDdDCCAlygAwIBAgIGAZyBHj7DMA0GCSqGSIb3DQEBCwUAMHsxFDASBgNVBAoTC0dvb2dsZSBJ
bmMuMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MQ8wDQYDVQQDEwZHb29nbGUxGDAWBgNVBAsTD0dv
b2dsZSBGb3IgV29yazELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWEwHhcNMjYwMjIx
MTY1MjQ4WhcNMzEwMjIwMTY1MjQ4WjB7MRQwEgYDVQQKEwtHb29nbGUgSW5jLjEWMBQGA1UEBxMN
TW91bnRhaW4gVmlldzEPMA0GA1UEAxMGR29vZ2xlMRgwFgYDVQQLEw9Hb29nbGUgRm9yIFdvcmsx
CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEApPjtg3VRAb7CeX/JkPZ/TAlTiiuc7RsFzsH0QJms3DgpqBsb4IKOzt7mYJyvNsif
fjFO+kkxFaWDCNwOoHdfwpaWuyKP0YHuHoE6tNQ/tV9qAwAie6C5391Y3VTxRiSYoHTTwTQPRYqm
b7TnfYk63EVsUNWP87OmxfkjuI2fS0/4zLP2ai+qoDhGUNRyZLfxII7V+3pwLL6OcbiV2N0AP5Yg
pCtzrESedrWCqD7Xv15kv54dtJHde5oqhvpJt6wIY7sVNVA9E61vRZZOGuYMpoVZpGS/nIcmcNRP
JtVqRmK0VDVROkkJ1X6FPHkdy3pXGIys4Q8bn6Wp7YPT9QSoTwIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQBEX373QXx6RlAzmNzp5/vpR1nxcEasNTJ2kYu2yZnCTcYZTO30RSNCZsWeVk9Xv9jquHor
mZtm54hn5wpvIp6WYZB1ybb4EVc0kghXyJmoN4nMuKyXranDzGCymk2x+OOcdeIWcgeJx7OCyWCA
un9YKAbUFBlfHQvupiPT9W2mwdGTh53kIMh5lYgBnx/2HUyGs3ubeQlKOUEggFJ2kzLc3puP3akQ
di1wF2n4dzqgHkObB9rSskgYw5UxgqC9MoTpxvDRpFPkJUkh1XEIJC+6Ea0T67CbsYZQjxucax58
IczvxmzoovSXvZcm6KMYlCTb4Yj+XZ6vZGLRDrCewMTS</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
    <md:SingleSignOnService
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
      Location="https://accounts.google.com/o/saml2/idp?idpid=C01r32475"/>
    <md:SingleSignOnService
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
      Location="https://accounts.google.com/o/saml2/idp?idpid=C01r32475"/>
  </md:IDPSSODescriptor>
</md:EntityDescriptor>
```

### B. Configure the Google SAML app (Service Provider details)

In **Google Admin Console → Apps → Web and mobile apps → your SAML app → Service Provider Details**, enter:

| Field | Value |
|---|---|
| **ACS URL** | `https://qjvwjszfpuimpmagpzqy.supabase.co/auth/v1/sso/saml/acs` |
| **Entity ID** | `https://qjvwjszfpuimpmagpzqy.supabase.co/auth/v1/sso/saml/metadata` |
| **Name ID format** | EMAIL |
| **Name ID** | Basic Information → Primary email |

### C. Set `VITE_SSO_DOMAIN` in your env

```env
VITE_SSO_DOMAIN=acme.com   # replace with your organisation's email domain
```

Users whose email belongs to this domain will be redirected to Google when they click **Sign in with Google SSO**.

### D. Allow-list the redirect URL in Supabase

In **Supabase Dashboard → Authentication → URL Configuration**, add your app's URL to **Redirect URLs**:

```
https://<your-app>.vercel.app/**
http://localhost:5173/**
```

---

## 4 — Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

---

## 5 — Deploy to Vercel

1. Push this repository to GitHub.
2. Go to <https://vercel.com> → **Add New Project** → import the repo.
3. Framework preset: **Vite** (auto-detected).
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` → set to your Vercel deployment URL (e.g. `https://my-app.vercel.app`)
   - `VITE_SSO_DOMAIN` → your org domain (if using SSO)
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

## How sessions work (JWT storage)

```
User signs in
    │
    ▼
supabase.auth.signInWithPassword / signInWithSSO
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
