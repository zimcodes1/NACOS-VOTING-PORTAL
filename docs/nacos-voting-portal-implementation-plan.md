# NACOS Software Exhibition — Implementation Plan
*(Product name: "NACOS Software Exhibition" — see naming note in Section 1)*

## 1. Overview

A web platform for a department-level software/graphic design exhibition with three user groups (public/students, judges, admins) and a real-time leaderboard for venue display. Software-track entrants pay a registration fee, collected **manually** (cash/transfer, handled offline by organizers) rather than through an in-app payment gateway — an admin marks a project's payment status as confirmed once received. This cuts the Paystack integration work out of the build entirely; see Section 6 for how the manual approval flow replaces it.

**Naming — read this before generating any UI copy, page titles, meta tags, or component names with an AI tool:** the product name is **"NACOS Software Exhibition."** Every screen (login, registration form, browser tab title, email/receipt subject lines, admin panel branding) should say "NACOS Software Exhibition" explicitly, not generic phrasing like "Student Portal," "NSUK Portal," or "Voting Portal." This is a standalone event microsite, not a module of the university's main student portal — the explicit name prevents an AI code-gen tool (or a first-time user) from assuming it's tied to `ug.nsuk.edu.ng` or any other existing NSUK system.

---

## 2. Recommended Stack

Given your existing stack (TypeScript/React, Django DRF/FastAPI, Ubuntu 22.04), here's what fits best for this specific project:

| Layer | Choice | Why |
|---|---|---|
| Frontend (public site + judges portal + live dashboard) | **React + TypeScript + Vite**, Tailwind CSS | Single frontend for 3 experiences (public voting, judge login, TV dashboard) as different routes. No need for React Native — this is browser/TV/phone-web, not a native app. |
| Backend API | **Django + Django REST Framework** | You already know it; built-in admin panel is huge here — organizers get a free CRUD interface to manage projects, judges, and votes without you building an admin UI from scratch. This alone saves days. |
| Real-time leaderboard | **Django Channels + Redis** (WebSockets) | Needed for the "live TV dashboard" requirement. Redis also doubles as your channel layer and can cache leaderboard aggregates. |
| Database | **PostgreSQL** | Correct choice — you need strong uniqueness constraints (matric number + category) and relational integrity between votes/scores/projects. |
| Payments | **Manual collection** (cash/bank transfer, offline) + admin-side "mark as paid" toggle | Cuts a full integration (gateway API, webhook signature verification, test/live key handling) out of the build. Organizers collect payment however works for the event and flip a status field in the admin panel. See Section 6. |
| Hosting (budget-friendly, matches your MediScan approach) | Frontend on **Vercel**, backend on **Render/Railway** (Django + Postgres + Redis add-ons), or a single Ubuntu VPS if you want everything self-hosted for the event | Render/Railway give you Postgres+Redis with minimal ops for a time-boxed event |

**Why not FastAPI here:** FastAPI is great for the AI-style stateless APIs you've used it for (MediScan, PhishShield), but this project's core complexity is relational data integrity + an admin backoffice + real-time fan-out — Django's ORM constraints, admin, and Channels ecosystem handle all three natively. Stick with one backend framework rather than splitting Django/FastAPI like your gate pass project; there's no clear seam here that benefits from two services, and it would just add deployment overhead for an event with a hard deadline.

---

## 3. System Architecture

```
                     ┌─────────────────────┐
                     │   React (Vite/TS)   │
                     │  - Public site       │
                     │  - Judge portal      │
                     │  - TV dashboard      │
                     └─────────┬────────────┘
                               │ REST (HTTPS) + WebSocket
                     ┌─────────▼────────────┐
                     │   Django + DRF        │
                     │  - Auth (judges/admin)│
                     │  - Voting logic       │
                     │  - Scoring logic      │
                     │  - Manual payment     │
                     │    approval (admin)   │
                     │  - Django Channels    │
                     └───┬───────────┬────────┘
                         │           │
              ┌──────────▼──┐   ┌────▼─────┐
              │ PostgreSQL  │   │  Redis    │
              │ (source of  │   │ (channel  │
              │  truth)     │   │  layer +  │
              └─────────────┘   │  cache)   │
                                 └───────────┘
```

---

## 4. Data Model (PostgreSQL / Django models)

```
Category
- id, name (e.g. "Software Development", "Graphic Design")
- requires_payment (bool)
- fee_amount (decimal, kobo)

Project
- id
- registration_code (unique, indexed — e.g. "NSE26-0001", auto-generated at
  submission time; this is the human-facing identifier the team uses to look
  up their project, reference it in support requests, or match a payment
  receipt to their entry. See 4.1 below for the generation scheme.)
- title, description, thumbnail_url, live_preview_url
- category (FK -> Category)
- team_name, team_members (JSON or related table)
- contact_name (team lead / point of contact)
- contact_email
- contact_phone
- registration_status (pending_payment / paid / confirmed)
- created_at

Payment
- id, project (FK)  -> this FK is what attributes a payment to a specific
  project; a project cannot have more than one *confirmed* payment
  (enforce with a partial unique constraint or an application check on
  status=confirmed).
- amount
- status (pending / confirmed / waived)  -- "waived" covers free-track
  entries (e.g. graphic design, if the committee decides it's fee-free)
  so the same model/field covers both tracks cleanly.
- confirmed_by (FK -> Django User, the admin/organizer who marked it paid)
- confirmed_at
- payment_method (free text or choices: "cash", "bank transfer", "other")
- notes (free text — e.g. transaction reference the student quotes, if
  paying by transfer, so an organizer can cross-check against the bank app)

Voter
- matric_number (unique, primary key or unique indexed)
- name (optional, if you want to capture it)
- device_fingerprint (optional, extra anti-abuse signal)

Vote
- id
- voter (FK -> Voter, or just matric_number string with unique_together)
- project (FK -> Project)
- category (FK -> Category)
- created_at
- UNIQUE constraint on (matric_number, category) -> enforces "one vote per category" at the DB level, not just app logic

Judge
- id, user (FK -> Django User), assigned_categories (M2M)

ScoreCriterion
- id, name (e.g. "Code Quality", "Functionality", "UI/UX")
- max_score, weight

Score
- id, judge (FK), project (FK), criterion (FK)
- value
- submitted (bool) - locks after final submission closes
- UNIQUE constraint on (judge, project, criterion)
```

### 4.1 Project Identity, Ownership & Contact Info

Two distinct problems were previously underspecified — worth being explicit about the fix:

**"Which user does this project belong to?"** You don't need a full user-accounts system with passwords for entrants (that's overkill for a one-time event registration). Instead, `contact_name`, `contact_email`, and `contact_phone` on `Project` *are* the ownership record — whoever registered the project is identified by that contact info, and it's also what makes the "opportunity contact" feature work (section 4.2 below). If a team needs to edit their submission later, they authenticate that edit request by supplying their `registration_code` + the `contact_email` they registered with (a simple "look up my project" form), rather than a full login system.

**"How do we uniquely identify a project across registration, payment, and voting?"** — the `registration_code`, generated once at successful registration:

- Format: `NSE26-XXXX` (**N**ACOS **S**oftware **E**xhibition, year, then a zero-padded sequential or short random suffix) — e.g. `NSE26-0001`, `NSE26-0002`. Django: an `AutoField`/sequence combined with a save-time formatter, or `uuid4().hex[:6].upper()` if you'd rather avoid guessable sequential codes (marginally more ballot-stuffing-resistant since it stops someone from enumerating `NSE26-0001` through `NSE26-0099`).
- This code is what appears on the project's public card (small, unobtrusive — organizers and judges use it to disambiguate two similarly-named projects), and in any support/payment communication ("I've made the transfer for NSE26-0034, please confirm" — an organizer searches this code in the admin panel to find and confirm the right project).
- `Payment.project` (the FK) is the actual attribution mechanism in the database — the `registration_code` is the *human-readable* face of that same relationship, so a student or organizer can talk about "project NSE26-0034" without needing to know or share the internal numeric `id`.

### 4.2 Contact Info as a Feature, Not Just a Field

Since `contact_email` / `contact_phone` are being captured anyway for registration and payment purposes, surface them (with consent) on the public project card or a "Contact the team" button on the project detail view — this turns the exhibition into a light networking/opportunity layer, letting other students, judges, or visiting recruiters reach out to a team whose project impressed them. Two implementation notes:

- Add a `show_contact_publicly` boolean (default `True`, but let teams opt out at registration) so a team that doesn't want their personal number public can hide it while still satisfying the internal attribution requirement.
- Don't render a raw `mailto:`/`tel:` phone number by default if you want to cut down on spam scraping — a simple "Contact team" button that reveals the info on click, or a lightweight contact form that emails the team without exposing the address directly, is a cheap upgrade if you have time; the plain link is fine for a first pass given the 2-day build window.

**Critical DB-level safeguard:** enforce the one-vote-per-matric-per-category rule with a Postgres `UNIQUE` constraint (`unique_together` in Django), not just a pre-check in application code. A pre-check + insert has a race condition under concurrent requests (many students voting in the same 10 seconds); the DB constraint is what actually prevents ballot stuffing.

---

## 5. Feature-by-Feature Implementation Notes

### 5.1 Home & Project Discovery
- Simple DRF `ListAPIView` on `Project`, filtered by `category`, with search on `title`/`description` (use Postgres `SearchVector` or just `icontains` — you don't need Elasticsearch for a department-sized entry list).
- Thumbnails: store in Django's media storage or Cloudinary/S3-compatible bucket if self-hosting storage is a pain on your VPS.
- "Live Preview Link" just opens in a new tab (`target="_blank"`) — no iframe embedding needed, and iframes will break for entries with restrictive CSP/X-Frame-Options anyway.
- Each card shows the `registration_code` in small print (e.g. bottom-right corner) for disambiguation, plus a "Contact team" affordance if `show_contact_publicly` is true (see 4.2).

### 5.2 Matric Number Verification
- No password needed — matric number acts as a lightweight identity token, but combine it with a simple check (e.g. matric number format regex + optional pre-loaded roster of valid matric numbers if the department can supply one, to block obviously fake entries like "TEST123").
- Store `matric_number` normalized (uppercase, stripped) before the uniqueness check.
- Rate-limit the verification endpoint (DRF throttling) to slow down scripted stuffing attempts.

### 5.3 Audience Voting
- Flow: verify matric number → show project confirmation screen → POST `/api/votes/` → DB unique constraint either succeeds or returns 409 Conflict ("already voted in this category") → frontend shows thank-you state.
- Persist voting status client-side (localStorage keyed by matric number) purely for UX (skip the confirmation screen next time), but never trust client state for the actual rule — always re-verify server-side.

### 5.4 Judges' Portal
- Django's built-in auth + DRF token or session auth is enough; no need for a heavier auth system for a handful of judge accounts. Create judge accounts manually via Django admin before the event.
- Scores editable until a global `voting_closed` flag (a simple `EventSettings` singleton model) is flipped by an admin — check this flag server-side on every score-submit request, not just in the UI.

### 5.5 Live Update Dashboard
- Django Channels consumer broadcasts on a `leaderboard` group whenever a `Vote` or `Score` is saved (use Django signals `post_save`).
- Compute combined ranking server-side: e.g. `final_score = (normalized_audience_votes * 0.4) + (normalized_judge_score * 0.6)` — agree on the weighting formula with the organizing committee ahead of time, don't hardcode an arbitrary split.
- Cache the computed leaderboard in Redis (short TTL, e.g. 3–5 sec) so a burst of votes doesn't hammer Postgres with recomputation on every single insert — recompute on a debounce/throttle rather than on every write.
- Frontend dashboard: plain WebSocket connection + Recharts/Chart.js for bars — this can literally run in a browser tab in kiosk mode plugged into the venue TV/HDMI, no native app needed.

---

## 6. Manual Payment Approval Flow (Software Track Registration)

No payment gateway integration — this whole section used to be Paystack init/verify/webhook work, which is now cut. Instead:

1. **Registration form** collects team/project info as normal but does **not** block on payment — a project can save with `Payment.status = pending` immediately, and `Project.registration_status = pending_payment`.
2. **On the confirmation screen**, show the team their `registration_code` plus clear instructions for how to pay (bank account details / whatever the department uses) and tell them to **quote their registration code** as the payment reference/narration — this is what lets an organizer match an incoming transfer to the right project without guesswork.
3. **Organizer confirms payment manually**: in the Django admin, an organizer finds the project (searchable by `registration_code`, `contact_email`, or `title`), and flips `Payment.status` to `confirmed`, filling in `confirmed_by` (auto-set to the logged-in admin user), `confirmed_at` (auto `now()`), and optionally `payment_method`/`notes`.
4. **A Django signal or `save()` override** on `Payment` automatically flips the related `Project.registration_status` to `confirmed` the moment `status` changes to `confirmed` — this is the one bit of "automation" left in the flow, so organizers don't have to remember to update two records separately.
5. **Public visibility rule stays the same as before**: only `confirmed` projects appear in the public voting grid — this prevents unpaid/unverified entries from being voted on, same guarantee you had with Paystack, just gated by a human instead of a webhook.
6. If the graphic-design track ends up fee-free (per the open question in Section 8), just create those `Project` rows with `Payment.status = waived` at registration time so the same `registration_status = confirmed` gate applies uniformly across both tracks.

**Trade-off worth being explicit about:** this removes a full day of integration/testing work (gateway setup, test-mode reconciliation, webhook signature verification, live-key cutover) but shifts the burden onto organizers doing manual reconciliation during a busy registration window — worth having at least one dedicated person on bank-alert-checking duty rather than leaving it ad hoc. If registration volume turns out to be higher than expected, you can always add Paystack back later as a v2 without changing the data model — `Payment.status` already has the right shape for it.

---

## 7. Suggested Build Order (given your Oct-style deadline pattern)

1. Django models + admin (get organizers a working backoffice on day one — they can start entering projects while you build the frontend).
2. Public project grid + search (read-only, no auth needed) — quick visible win.
3. Matric number verification + voting with the DB unique constraint — this is the highest-risk feature (ballot stuffing), build and test it early and hammer it with concurrent requests before trusting it.
4. Registration form + manual payment approval flow in admin — much faster now than a full gateway integration, but still test the "registration_status flips to confirmed only after Payment.status=confirmed" logic properly.
5. Judges' portal.
6. Channels + Redis real-time dashboard — build last since it depends on votes/scores existing to visualize.

---

## 8. Open Questions to Settle With the Committee Before Building

- Does the **graphic design** track also require the registration fee, or only software development (your message implies only software)? Affects whether those entries get `Payment.status = waived` automatically at registration.
- Who on the organizing team is responsible for checking incoming transfers/cash and confirming payments in the admin panel during the registration window — this needs a named owner now that it's manual, not automatic.
- What's the **audience-vote vs judge-score weighting** for the combined leaderboard?
- Is there an **official matric number roster** the department can provide to validate against, or is format-checking + one-vote-per-category the only safeguard?
- Expected concurrent load at peak voting (affects whether a single small VPS is enough or you need to scale the DB connections/Redis a bit).
- Will the TV dashboard run on venue wifi reliably, or should it have a polling fallback if the WebSocket drops?

---

## 9. Environment/Deployment Checklist

- `.env`: `DJANGO_SECRET_KEY`, `DATABASE_URL`, `REDIS_URL`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`.
- Django Channels needs an ASGI server in production (Daphne or Uvicorn+Channels) — not the default WSGI dev server.
- Postgres connection pooling (e.g. `django-db-geventpool` or just Render/Railway's managed Postgres, which handles this) if you expect a vote-rush spike.
- HTTPS is still recommended (matric number submissions, judge login) even without a payment gateway in the mix.
