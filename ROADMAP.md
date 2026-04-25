# School Website — Roadmap

This document is the **single source of truth** for upcoming work on the school website. Anyone (human or agent) picking up the project should start here.

- **Update this file** as part of every feature PR — mark items `[x]` when merged, link the PR, and append a short note under "Progress log" at the bottom.
- **Order matters within a phase** but phases can be reordered if priorities change. Don't skip phases without writing down why.
- **Each task should ship as its own PR** unless explicitly grouped (small foundation chores can share a PR).

Legend:
- `[ ]` not started
- `[~]` in progress
- `[x]` done (link the PR)
- 🤖 = fully autonomous (an agent can ship this without external secrets or dashboard changes)
- 🔑 = needs a one-time credential / dashboard toggle from the school admin
- 🧭 = needs explicit product sign-off before building (scope is large or design-shaped)

---

## Status snapshot

| Phase | Theme | Status |
|---|---|---|
| 0 | Already shipped | ✅ done |
| 1 | Foundations & hygiene | ⏳ next |
| 2 | Content authoring polish | ⏳ |
| 3 | Search & discoverability | ⏳ |
| 4 | Roles & permissions | ⏳ |
| 5 | Admissions UX upgrade | ⏳ |
| 6 | Multi-campus & multi-language | ⏳ |
| 7 | Reliability (E2E tests) | ⏳ |
| Side track A | Notifications & comms | ⏳ |
| Side track B | Payments & SMS | ⏳ |
| Side track C | Observability | ⏳ |
| Side track D | Auth hardening | ⏳ |
| Side track E | Operational backups | ⏳ |
| Side track F | Big bets | 🧭 needs sign-off |

---

## Phase 0 — Already shipped ✅

Recorded for context so newcomers know what's already in place.

- [x] Public website with Home, About, Academics, Admissions, News, Events, Gallery, Staff, Contact, Privacy, Cookies, Share-Your-Story
- [x] Admin CMS with Posts (TipTap), Gallery, Applications, Messages, Staff, Events, Testimonials, Academic Calendars
- [x] Supabase Auth + middleware-protected admin routes
- [x] Row-Level Security on every table
- [x] Cloudflare Turnstile bot protection on public forms
- [x] Sitemap, robots, JSON-LD on news posts
- [x] Search dialog (Ctrl/⌘+K) across posts, gallery, events
- [x] Light/dark theme toggle
- [x] Floating WhatsApp button
- [x] Scroll-reveal fix for content streamed in after loading fallback (#23)
- [x] Editable site contact info + social handles in `/admin/settings` (#24)

---

## Phase 1 — Foundations & hygiene 🤖

Pure code-side hardening. No new product surface; pays dividends on every later PR.

- [ ] **Security headers** in `next.config.ts` (CSP, HSTS, Referrer-Policy, Permissions-Policy)
- [ ] **De-duplicate theme colors** — generate `globals.css` CSS variables from `school.ts` at build time so `colors` lives in one place
- [ ] **CI gate via GitHub Actions** — run `npm run lint`, `tsc --noEmit`, and `npm audit` on every PR; required for merge
- [ ] **Audit log table** — `audit_log` migration + thin server-action wrapper that records who/what/when/before/after for admin writes (no UI yet, just the data)

**Exit criteria:** CI is required on PRs. New admin writes pass through the audit wrapper. Theme color is edited in exactly one place.

---

## Phase 2 — Content authoring polish 🤖

Removes the most painful day-to-day friction for the school's editor.

- [ ] **Image upload from inside the post editor** — drag-and-drop into TipTap, uploads to existing Supabase Storage `posts` bucket (create bucket if missing), inserts the public URL into the doc
- [ ] **News pagination + tags/topics** — `tags TEXT[]` on `posts`, simple per-tag filter on `/news`, paginated 12-per-page list
- [ ] **Scheduled publishing** for posts and events — `publish_at` column + Vercel Cron job that flips `published = true` once the time arrives

**Exit criteria:** An admin can write a fully illustrated, tagged, scheduled post end-to-end without leaving the dashboard.

---

## Phase 3 — Search & discoverability 🤖

Search currently uses `LIKE %query%`. Fine today, will degrade past a few thousand rows.

- [ ] **Postgres full-text search** — `tsvector` columns on `posts`, `events`, `gallery` with GIN indexes; rewrite `actions/search.ts` to use `to_tsquery` + ranking; weight title higher than body
- [ ] **Search shows tags** in results (depends on Phase 2)

**Exit criteria:** Search ranks results by relevance, returns snippets, and stays sub-100ms at 10k+ rows.

---

## Phase 4 — Roles & permissions 🤖

Currently every admin is fully privileged. This is the single biggest "not-ready-for-multi-staff" gap.

- [ ] **Multi-role admins** — `admins.role` column with `super_admin` / `editor` / `admissions_officer`; rewrite RLS policies to gate per-table by role; gate sidebar links by role; gate server actions by role
- [ ] **Audit log UI** — surface the table from Phase 1 as an `/admin/audit-log` page (super_admin only)

**Exit criteria:** A school can grant an editor publishing rights to news without giving them access to admissions data, and every action they take is logged.

---

## Phase 5 — Admissions UX upgrade 🤖🔑

The single highest-leverage upgrade for parents.

- [ ] **Application document upload** — multi-file upload on the public application form (birth certificate, last report card, photo). 🔑 *Requires a Supabase Storage bucket called `applications` to be created in the dashboard — one-time, by the school admin.*
- [ ] **Application status portal** for parents — magic-link-authenticated `/applications/me` page where applicants can see status updates and any messages from the admissions office

**Exit criteria:** A parent applies, uploads docs, gets a magic-link to track progress; the school replies through the portal instead of via email.

---

## Phase 6 — Multi-campus & multi-language 🤖

Future-proofing for growth.

- [ ] **Multi-campus support** — `campuses` table with per-campus contact info, programs, leadership; campus selector on relevant public pages
- [ ] **Multi-language scaffold** — `next-intl` setup with English baseline + structure for Twi (and optionally French); the school fills the translation strings, the scaffolding is autonomous

**Exit criteria:** A second campus can be added by the admin without code changes, and a translator can fill a language file without engineering involvement.

---

## Phase 7 — Reliability 🤖

The longer the project runs, the more this matters.

- [ ] **Playwright E2E test suite** covering: admin login, post publishing, contact form submission, application form submission, application status portal, settings edit
- [ ] **Run E2E tests in CI** (depends on Phase 1's CI gate)

**Exit criteria:** Every PR runs the suite; a regression in any of the above breaks CI.

---

## Side tracks (parallel to the main phases)

These don't depend on the main sequence. They each need one piece of input from you (🔑) before I can start.

### Side track A — Notifications & comms 🔑

- [ ] **Resend integration** — auto-reply email on application + contact form submissions; admin notification email on new submissions  *(needs `RESEND_API_KEY`)*
- [ ] **Newsletter signup** — public form + admin broadcast view  *(reuses Resend key)*

### Side track B — Payments & SMS 🔑

- [ ] **Paystack integration** — application fee payment on the admissions form  *(needs `PAYSTACK_SECRET_KEY`, business account)*
- [ ] **Hubtel SMS** — text the applicant when status changes  *(needs Hubtel client ID + secret)*

### Side track C — Observability 🔑

- [ ] **Sentry error monitoring**  *(needs `SENTRY_DSN`)*
- [ ] **Plausible / Umami analytics**  *(needs hosted analytics site or self-hosted endpoint)*

### Side track D — Auth hardening 🔑

- [ ] **2FA on admin login**  *(needs MFA enabled on the Supabase project; one toggle in dashboard)*
- [ ] **Password rotation policy + admin-invite flow** for new staff

### Side track E — Operations 🔑

- [ ] **Server-side image resizing** on uploads  *(needs Supabase image transformation feature enabled)*
- [ ] **Dedicated staging Supabase project** + matching Vercel deploy  *(needs you to create a second free Supabase project)*
- [ ] **Automated daily backups → S3 / Backblaze**  *(needs S3-compatible bucket + IAM keys)*

### Side track F — Big bets 🧭

These need explicit product sign-off before any code is written.

- [ ] **Parent / student portal** — fee balances, attendance, report cards
- [ ] **LMS-lite** — assignments, materials, teacher uploads
- [ ] **Public alumni network** — login-gated directory + jobs board

---

## Progress log

A short, prose-style note for each merged feature. Newest at the top.

- **2026-04-25** — Editable contact info + social media handles in `/admin/settings` shipped (#24).
- **2026-04-25** — Scroll-reveal stops requiring a manual page refresh after navigation (#23).

---

## Conventions for agents working on this project

1. **Read this file first.** Pick the next unchecked item from the lowest-numbered phase that isn't blocked by a 🔑 prerequisite.
2. **One feature per PR.** If you find yourself creating two unrelated migrations, split the PR.
3. **Always update this file** in the same PR that ships the feature: flip the checkbox, link the PR, add a Progress-log entry.
4. **Migrations are human-runnable.** Any new `.sql` file in `supabase/` must be safe to re-run (`IF NOT EXISTS`, `DROP POLICY IF EXISTS`).
5. **Defaults must not break the site.** New DB-backed features must fall back to a safe default if the migration hasn't run yet (see `actions/site-settings.ts` for the pattern).
6. **No silent breakage of public pages.** Never let a Supabase error 500 a public page; catch and degrade gracefully.
