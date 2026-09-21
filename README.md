# DOMICA landing page — deploy on Vercel

The DOMICA landing page (domicahomes.com). It's a **static site**: a single
self-contained `index.html` (all HTML/CSS/JS/images/fonts embedded). No build
step, no framework, no server-side runtime, no database.

## Files
- `index.html` — the entire website. Serving this file *is* the site.
- `vercel.json` — minimal Vercel config (`cleanUrls`, no build).
- `DOMICA Landing Page.html` — original export (same content as index.html; kept for reference, not served).
- `google-apps-script/Code.gs` — backend for the contact form (Google Apps Script).
- `FORM-SETUP.md` — how to deploy Code.gs and connect the form.
- `HANDOFF.md` — full handoff notes (hosting, DNS, form) for taking the whole thing over.

## Deploy on a new Vercel account

### Option A — drag & drop (fastest)
1. Log into the target Vercel account.
2. Vercel dashboard → **Add New… → Project → Deploy** (or use the Vercel CLI:
   `npm i -g vercel` then run `vercel` in this folder).
3. Framework preset: **Other**. Build command: **(none)**. Output dir: **(leave default)**.
4. Deploy. The site serves `index.html` at the root.

### Option B — from Git (recommended for ongoing edits)
1. Push these files to a new Git repo (GitHub/GitLab/Bitbucket).
2. In Vercel → **Add New… → Project → Import** that repo.
3. Framework preset **Other**, no build command. Deploy. Pushes to the default
   branch auto-deploy.

## Custom domain (domicahomes.com)
1. In the new Vercel project → **Settings → Domains** → add `domicahomes.com`
   and `www.domicahomes.com`.
2. Vercel shows the exact DNS records. In GoDaddy, point the domain at the new
   project (typically `A @ -> 76.76.21.21` and `CNAME www -> cname.vercel-dns.com`,
   but use whatever the new project's Domains screen shows).
3. Leave the existing **MX/email records** untouched so `@domicahomes.com` email
   keeps working.
4. If migrating from the old project: add the domain and re-point DNS to the new
   project **before** deleting the old one, so the site never goes dark.

## Contact form (not connected yet)
On submit the form POSTs the collected fields as JSON to a single endpoint,
which is currently a placeholder — until it's set, submissions go nowhere.

To finish it:
1. Deploy `google-apps-script/Code.gs` as a Google Apps Script web app
   (see `FORM-SETUP.md`). It appends each submission to a Google Sheet and emails
   `info@domicahomes.com` (which forwards to jennifer@domicahomes.com). Deploy it
   under a domicahomes.com Google account so notifications send from the domain.
2. Put the resulting `/exec` URL into the form. The endpoint lives as the
   placeholder string `__FORM_ENDPOINT__` inside the form's bundled script in
   `index.html`; replace it with the real URL and redeploy.
   - Note: the page is a compiled/bundled export, so that script is inside a
     gzip+base64 asset in `index.html`. Easiest is to edit at the original design
     source if available; otherwise the asset can be decoded, edited, and
     re-encoded.

### Spam protection
The form has an invisible honeypot field named `website`. Real users never fill
it; `Code.gs` drops any submission where it's filled. No captcha keys needed.

### Form fields (JSON keys)
companyName, contactName, role, email, phone, employerType, market, employees,
seasonality, beds, timing, budget, subsidize, services[], servicesOther,
situation, heard, source, submittedAt
