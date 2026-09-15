# DOMICA landing page — handoff

This is everything needed to take over the DOMICA landing page (domicahomes.com)
end to end. It is a small static site, so it can be hosted almost anywhere.

## What's included
- **index.html** — the entire website. One self-contained file (all HTML, CSS,
  JavaScript, images and fonts are embedded). Serving this file *is* the site.
- **Code.gs** — the backend script for the contact form (Google Apps Script).
- **FORM-SETUP.md** — step-by-step to deploy Code.gs and connect the form.

## Current setup (being handed off)
- **Hosting:** Vercel (personal account), auto-deploys a GitHub repo, static, HTTPS.
  This account is going away — please re-host on your own infrastructure.
- **Domain:** domicahomes.com on GoDaddy. Currently pointed at Vercel via:
  - CNAME  `www`  ->  `cname.vercel-dns.com`
  - A      `@`    ->  `76.76.21.21`
  - (MX/email records are separate and should stay as they are.)

## How to take it over

### 1. Host the site
It's a single static file, so any static host works — Vercel, Netlify,
Cloudflare Pages, Azure Static Web Apps, S3+CloudFront, or a plain web server
(IIS/Apache/nginx). Just serve `index.html` as the root document. No build step,
no server-side runtime, no database.

### 2. Re-point DNS (in GoDaddy)
Change the `www` CNAME and `@` A record to point at your new host instead of
Vercel (your host will tell you the exact target values). Leave the MX/email
records untouched.

### 3. Order matters
Stand up the new hosting and update DNS **before** the old Vercel project is
deleted, so the live site never goes down during the switch.

## The contact form (currently not connected)
The page has a multi-step intake form. On submit it POSTs the collected fields
as JSON to a single endpoint. That endpoint is **not set yet** — until it is,
submissions are not delivered anywhere.

To finish it:
1. Deploy `Code.gs` as a Google Apps Script web app (see `FORM-SETUP.md`). It
   logs each submission to a Google Sheet and emails `info@domicahomes.com`
   (which forwards to jennifer@domicahomes.com). Deploying it under a
   domicahomes.com Google account makes the notifications send from your domain.
2. Put the resulting web-app `/exec` URL into the form as its endpoint. In the
   page source the endpoint is a placeholder string `__FORM_ENDPOINT__` inside
   the form's bundled script; replace it with the real URL and redeploy the page.

### Spam protection
The form includes an invisible "honeypot" field named `website`. Real users
never see or fill it; `Code.gs` drops any submission where it is filled. No
third-party captcha or keys required.

### Form fields sent (JSON keys)
companyName, contactName, role, email, phone, employerType, market, employees,
seasonality, beds, timing, budget, subsidize, services[], servicesOther,
situation, heard, source, submittedAt
