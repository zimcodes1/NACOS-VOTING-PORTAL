# NACOS Software Exhibition & Voting Portal — Implementation Plan

## 1. Overview

A web platform for a department-level software/graphic design exhibition with three user groups (public/students, judges, admins) and a real-time leaderboard for venue display. Software-track entrants pay a registration fee via Paystack; graphic-design entrants may or may not (clarify with the organizing committee — see Open Questions).

---

## 2. Recommended Stack

Given your existing stack (TypeScript/React, Django DRF/FastAPI, Ubuntu 22.04), here's what fits best for this specific project:

| Layer | Choice | Why |
|---|---|---|
| Frontend (public site + judges portal + live dashboard) | **React + TypeScript + Vite**, Tailwind CSS | Single frontend for 3 experiences (public voting, judge login, TV dashboard) as different routes. No need for React Native — this is browser/TV/phone-web, not a native app. |
| Backend API | **Django + Django REST Framework** | You already know it; built-in admin panel is huge here — organizers get a free CRUD interface to manage projects, judges, and votes without you building an admin UI from scratch. This alone saves days. |
| Real-time leaderboard | **Django Channels + Redis** (WebSockets) | Needed for the "live TV dashboard" requirement. Redis also doubles as your channel layer and can cache leaderboard aggregates. |
| Database | **PostgreSQL** | Correct choice — you need strong uniqueness constraints (matric number + category) and relational integrity between votes/scores/projects. |
| Payments | **Paystack** (Standard Checkout or Inline popup) | Required per your brief for software-track registration fees. |
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
                     │  - Paystack webhooks  │
                     │  - Django Channels    │
                     └───┬───────────┬────────┘
                         │           │
              ┌──────────▼──┐   ┌────▼─────┐
              │ PostgreSQL  │   │  Redis    │
              │ (source of  │   │ (channel  │
              │  truth)     │   │  layer +  │
              └─────────────┘   │  cache)   │
                                 └───────────┘
                     ┌────────────────────┐
                     │   Paystack API      │
                     │ (payment + webhook) │
                     └────────────────────┘
```

---

## 4. Data Model (PostgreSQL / Django models)

```
Category
- id, name (e.g. "Software Development", "Graphic Design")
- requires_payment (bool)
- fee_amount (decimal, kobo)

Project
- id, title, description, thumbnail_url, live_preview_url
- category (FK -> Category)
- team_name, team_members (JSON or related table)
- registration_status (pending_payment / paid / confirmed)
- created_at

Payment
- id, project (FK)
- paystack_reference (unique)
- amount, status (pending/success/failed)
- verified_at
- raw_webhook_payload (JSONField, for audit)

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

**Critical DB-level safeguard:** enforce the one-vote-per-matric-per-category rule with a Postgres `UNIQUE` constraint (`unique_together` in Django), not just a pre-check in application code. A pre-check + insert has a race condition under concurrent requests (many students voting in the same 10 seconds); the DB constraint is what actually prevents ballot stuffing.

---

## 5. Feature-by-Feature Implementation Notes

### 5.1 Home & Project Discovery
- Simple DRF `ListAPIView` on `Project`, filtered by `category`, with search on `title`/`description` (use Postgres `SearchVector` or just `icontains` — you don't need Elasticsearch for a department-sized entry list).
- Thumbnails: store in Django's media storage or Cloudinary/S3-compatible bucket if self-hosting storage is a pain on your VPS.
- "Live Preview Link" just opens in a new tab (`target="_blank"`) — no iframe embedding needed, and iframes will break for entries with restrictive CSP/X-Frame-Options anyway.

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

## 6. Paystack Integration (Software Track Registration)

1. **Initialize transaction** (backend): `POST https://api.paystack.co/transaction/initialize` with `email`, `amount` (in kobo), and a `reference` you generate and store against the `Payment` row as `pending`.
2. **Redirect/Inline**: use Paystack Inline JS popup on the registration form (better UX than full redirect for a mobile-heavy student audience) or the hosted checkout redirect — either works.
3. **Verify, don't trust the frontend callback**: after Paystack redirects back with success, call `GET https://api.paystack.co/transaction/verify/:reference` server-side before marking `Payment.status = success`. Never flip payment status based solely on the frontend callback — it can be spoofed.
4. **Webhook (required, not optional)**: set up a `POST /api/paystack/webhook/` endpoint, verify the `x-paystack-signature` header (HMAC SHA512 with your secret key) on every incoming webhook, and use `charge.success` events as the authoritative source of truth for payment confirmation — this covers cases where the student closes the tab right after paying but before the redirect completes.
5. Keep your **secret key server-side only**, in environment variables — never in the React bundle. Only the **public key** goes to the frontend for Inline.js.
6. Project's `registration_status` flips from `pending_payment` → `confirmed` only after webhook-verified payment — this is what unlocks it appearing in the public voting grid.

---

## 7. Suggested Build Order (given your Oct-style deadline pattern)

1. Django models + admin (get organizers a working backoffice on day one — they can start entering projects while you build the frontend).
2. Public project grid + search (read-only, no auth needed) — quick visible win.
3. Matric number verification + voting with the DB unique constraint — this is the highest-risk feature (ballot stuffing), build and test it early and hammer it with concurrent requests before trusting it.
4. Paystack registration flow + webhook — test thoroughly in Paystack test mode before going live.
5. Judges' portal.
6. Channels + Redis real-time dashboard — build last since it depends on votes/scores existing to visualize.

---

## 8. Open Questions to Settle With the Committee Before Building

- Does the **graphic design** track also require the registration fee, or only software development (your message implies only software)?
- What's the **audience-vote vs judge-score weighting** for the combined leaderboard?
- Is there an **official matric number roster** the department can provide to validate against, or is format-checking + one-vote-per-category the only safeguard?
- Expected concurrent load at peak voting (affects whether a single small VPS is enough or you need to scale the DB connections/Redis a bit).
- Will the TV dashboard run on venue wifi reliably, or should it have a polling fallback if the WebSocket drops?

---

## 9. Environment/Deployment Checklist

- `.env`: `DJANGO_SECRET_KEY`, `DATABASE_URL`, `REDIS_URL`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY` (frontend only), `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`.
- Django Channels needs an ASGI server in production (Daphne or Uvicorn+Channels) — not the default WSGI dev server.
- Postgres connection pooling (e.g. `django-db-geventpool` or just Render/Railway's managed Postgres, which handles this) if you expect a vote-rush spike.
- HTTPS is mandatory — Paystack webhooks and Inline.js require it.
