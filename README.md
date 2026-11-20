# Adam Law Chamber — Website & Admin Panel

Public website for Adam Law Chamber with a built-in admin panel for managing all content without touching code.

- **Public site:** Home, About, Practice Areas, Our Team, Insights (blog), FAQ, Contact
- **Admin panel** (`/admin`): edit practice areas, team, testimonials, FAQs, blog posts, home page content, firm details, SEO settings, and read enquiries from the contact form
- **SEO:** per-page titles/descriptions, canonical URLs, `sitemap.xml`, `robots.txt`, social-share image, and schema.org structured data (LegalService, FAQ, breadcrumbs)

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS 4 · Prisma 6 · Turso (libSQL / SQLite)

---

## 1. Run it locally

Requirements: **Node.js 20.12+**. No database server is needed locally — the site uses a file, `prisma/dev.db`, created on first setup.

```bash
npm install
cp .env.example .env        # then fill in the values (see below)
npm run setup               # creates prisma/dev.db with the tables, starter content and first admin account
npm run dev                 # http://localhost:3000
```

Admin panel: <http://localhost:3000/admin> — sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

### Environment variables (`.env`)

| Variable | What it is |
| --- | --- |
| `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | The Turso database (`libsql://…`) and its token. Leave empty locally to use `prisma/dev.db` |
| `AUTH_SECRET` | Long random string that signs admin sessions. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `SITE_URL` | Public address of the site, no trailing slash, e.g. `https://www.adamlawchamber.com`. Used for canonical links, the sitemap and social previews |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | The first admin account, created when the database is new. Not used after that |

`.env` holds passwords and must never be committed (it is already in `.gitignore`).

### Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build. Also brings the database up to date (`db:setup`) |
| `npm start` | Runs the production build |
| `npm run setup` / `npm run db:setup` | Creates missing tables and new columns from `prisma/schema.prisma`; on a new database, also adds starter content and the admin account. Never deletes data |
| `npm run db:seed` | Adds starter content and the admin account. Safe to re-run — it only fills in what is missing |
| `npm run lint` | ESLint |

> **Don't run `npm run build` while `npm run dev` is running** in the same folder — both write to `.next/` and the build fails with `Invariant: no direct app page entry found`. Stop the dev server first.

---

## 2. Deploy (Vercel + Turso)

1. **Create a Turso database** at [turso.tech](https://turso.tech) — pick the location closest to Vercel's server region (default: AWS US East, Virginia).
2. **Connect it to Vercel:** Vercel project → **Storage** → connect the Turso database (this adds `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`). Or add those two variables by hand from the Turso dashboard (database → *Connect*: URL + a new token).
3. **Add the other variables** in Vercel → Settings → Environment Variables: `AUTH_SECRET` (new random string), `SITE_URL` (the live address), `ADMIN_EMAIL` and `ADMIN_PASSWORD` (first admin login), and optionally the `SMTP_*` email settings. Remove any old `DATABASE_URL` that starts with `mysql://`.
4. **Deploy** (push to GitHub, or Redeploy in Vercel — variable changes only apply to a new deployment). The build creates the tables and, on a new database, the starter content and admin account. If no Turso database is connected, the build stops with a message saying so.
5. **After going live:** sign in at `/admin`, change the admin password under **Account**, fill in firm details under **Settings** (phone, WhatsApp, address, map, social links, SEO), and submit `https://<your-domain>/sitemap.xml` in Google Search Console.

Schema changes that add tables or fields are applied automatically on the next deploy. Renaming or removing a field needs a manual migration.

---

## 3. How things work

**Content** lives in the database, so everything editable in the admin panel survives redeploys. Blog posts and long text fields accept Markdown.

**Pages & sections** (`/admin/pages`) edits all remaining text on the site, page by page: section headings, the “Why choose us” boxes, “How we work” steps, values, buttons, page banners and Google titles/descriptions, the contact panel and form labels, the menu drop-downs, footer and call-to-action band. Home-page sections can be hidden with “Show this section”. Lists (boxes, steps, values…) can be added to, removed and reordered. Each section has *Restore original text*. The built-in wording lives in `src/lib/content.ts`; saved edits are stored in the `PageContent` table and override it field by field.

**Image uploads** (team photos, hero image, etc.) are stored in the database and served from `/media/<id>`. Accepted: JPG, PNG, WebP, GIF up to 4 MB. Because they are in the database, back up the database to back up the images.

**Admin security:** passwords are bcrypt-hashed; sessions are signed, http-only cookies; `/admin` and `/api/admin` are protected by middleware and again inside each action; repeated wrong passwords are throttled for 15 minutes; admin pages are marked `noindex`.

**Contact form** submissions are saved to the database and appear under **Messages** in the admin panel (unread count shown in the sidebar). A hidden honeypot field filters simple bots.

**Email alerts:** when SMTP is configured, every new enquiry is also emailed to the firm — with the client's details, their message, and a button to open it in the admin panel. Pressing *Reply* answers the client directly. The email is sent after the visitor sees the confirmation, so a mail problem never affects the form; the enquiry is always saved first. Add these environment variables to turn it on:

| Variable | Example |
| --- | --- |
| `SMTP_HOST` | `smtp.hostinger.com` (Hostinger email) · `smtp.gmail.com` (Gmail / Google Workspace) |
| `SMTP_PORT` | `465` |
| `SMTP_USER` / `SMTP_PASS` | The mailbox login. For Gmail use an App Password, not the normal password |
| `MAIL_FROM` | Sender address — usually the same as `SMTP_USER` |
| `CONTACT_ALERT_TO` | Who receives alerts, comma-separated. If empty, the email in **Admin → Settings** is used |

**Admin → Settings** shows under the email field whether alerts are on and where they go, and the dashboard checklist reminds you until they are set up. If an alert can't be sent, the reason is written to the server log (`[contact] Email alert …`).

**Branding**

| File | Used for |
| --- | --- |
| `brand-src/logo-original.png` | Original logo artwork (source, not served) |
| `public/brand/logo.png` | Full logo — footer, home page, admin login, social image |
| `public/brand/logo-mark.png` | Emblem only — site header, admin sidebar, 404 page |
| `public/brand/logo-square.png` | Logo on navy square — Google structured data |
| `src/app/icon.png`, `apple-icon.png`, `favicon.ico` | Browser tab and home-screen icons |

A logo uploaded under **Admin → Settings → Logo** replaces the header emblem.

### Project layout

```
prisma/
  schema.prisma          database tables
  seed.ts                starter content + first admin account
src/
  app/(site)/            public pages
  app/admin/             admin panel (login, panel pages, server actions)
  app/api/admin/upload/  image upload endpoint
  app/media/[id]/        serves uploaded images
  app/sitemap.ts, robots.ts, opengraph-image.tsx
  components/site/       header, footer, page sections
  components/admin/      admin form controls and lists
  lib/                   database client, data queries, auth/session, SEO helpers
  middleware.ts          protects /admin and /api/admin
```
