# NACOS Voting Portal — 2-Day Build Roadmap

Scope note: 2 days gets you a working skeleton with all 5 screens wired to real endpoints, DB constraints enforced, and Paystack in **test mode**. Treat Day 2 evening as a checkpoint, not a finish line — real device testing and Paystack live-mode switch should happen after this roadmap, with buffer before the actual event.

---

## DAY 1 — Backend Foundation + Core Data Flow

### Stage 1: Scaffolding (Hour 0–1)

**Backend — Django project**

```bash
mkdir nacos-voting-portal && cd nacos-voting-portal
mkdir backend frontend

cd backend
python3 -m venv venv
source venv/bin/activate

pip install django djangorestframework django-cors-headers \
    psycopg2-binary python-decouple \
    channels channels-redis daphne \
    requests django-filter

django-admin startproject config .
python manage.py startapp core        # projects, categories, votes
python manage.py startapp payments    # paystack integration
python manage.py startapp judging     # judges, scores
python manage.py startapp realtime    # channels consumers
```

**Backend packages — what each is for**

| Package | Purpose |
|---|---|
| `django` | Core framework |
| `djangorestframework` | REST API layer |
| `django-cors-headers` | Allow React frontend origin to call the API |
| `psycopg2-binary` | Postgres driver |
| `python-decouple` | Clean `.env` config loading |
| `channels` + `daphne` | ASGI + WebSocket support for live dashboard |
| `channels-redis` | Redis as the Channels layer backend |
| `requests` | Server-side calls to Paystack API |
| `django-filter` | Category/search filtering on project list endpoint |

**Frontend — React + TS**

```bash
cd ../frontend
npm create vite@latest . -- --template react-ts
npm install
npm install axios react-router-dom @tanstack/react-query
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install recharts        # for the live leaderboard graphs
```

| Package | Purpose |
|---|---|
| `axios` | API calls |
| `react-router-dom` | Routes: `/`, `/vote/:projectId`, `/judge`, `/dashboard` |
| `@tanstack/react-query` | Server state/caching, auto-refetch fallback if WebSocket drops |
| `tailwindcss` | Styling |
| `recharts` | Leaderboard bars/graphs on the TV dashboard |

**Postgres + Redis (local dev, Ubuntu 22.04)**

```bash
sudo apt install postgresql postgresql-contrib redis-server
sudo -u postgres createdb nacos_voting
sudo -u postgres createuser nacos_user --pwprompt
```

`.env` in `backend/`:
```
SECRET_KEY=...
DEBUG=True
DATABASE_URL=postgres://nacos_user:password@localhost:5432/nacos_voting
REDIS_URL=redis://localhost:6379/0
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**End of Stage 1 checkpoint:** `python manage.py runserver` and `npm run dev` both boot cleanly, empty pages, no errors.

---

### Stage 2: Models + Admin (Hour 1–3)

- Write all models from the data model spec: `Category`, `Project`, `Voter`, `Vote`, `Payment` (in `core`/`payments`), `Judge`, `ScoreCriterion`, `Score` (in `judging`).
- Add the `unique_together = ("matric_number", "category")` constraint on `Vote` immediately — this is the highest-risk rule, get it into a migration on day 1.
- Register everything in `admin.py` for each app with sensible `list_display` (organizers will live in this admin panel to enter projects).
- Run migrations.

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

**Checkpoint:** Log into `/admin/`, manually create 1 category, 2 projects, confirm they save.

---

### Stage 3: Core Read APIs — Project Discovery (Hour 3–4.5)

- DRF serializers + `ListAPIView`/`RetrieveAPIView` for `Project`, filtered by `category`, searchable by title/description (`django-filter` + `SearchFilter`).
- `GET /api/categories/`
- `GET /api/projects/?category=&search=`
- `GET /api/projects/:id/`

**Frontend:** Build the Home screen grid — fetch via React Query, render cards (title, thumbnail, description, live preview link, vote button). Add filter/search bar wired to query params.

**Checkpoint:** Home page renders real projects from Postgres via the API, search/filter works.

---

### Stage 4: Voting Flow (Hour 4.5–7)

**Backend:**
- `POST /api/verify-voter/` — validates matric number format, checks/creates `Voter` row.
- `POST /api/votes/` — accepts `matric_number`, `project_id`; catches `IntegrityError` from the unique constraint and returns `409` with a clean "already voted in this category" message.
- Throttle this endpoint (`DRF ScopedRateThrottle`) to blunt scripted stuffing.

**Frontend:**
- Matric number prompt modal.
- Confirmation screen ("You are voting for X — confirm?").
- Post-vote locked state + "Thank you for voting!" message.
- Store voted-category state in `localStorage` for UX only (never trust it for the actual rule).

**Checkpoint — stress test now, not later:** fire ~20 concurrent duplicate vote requests (same matric number, same category) with a quick script or `curl` in a loop, confirm only 1 succeeds and the rest get clean 409s, not raw 500 errors.

```bash
for i in {1..20}; do
  curl -s -X POST http://localhost:8000/api/votes/ \
    -H "Content-Type: application/json" \
    -d '{"matric_number":"CSC/2021/001","project_id":1}' &
done
wait
```

**End of Day 1 goal:** Home + Voting fully functional end-to-end against real Postgres, duplicate-vote protection verified under concurrency, admin panel usable by organizers to start entering real project data overnight.

---

## DAY 2 — Payments, Judging, Real-Time Dashboard

### Stage 5: Paystack Integration (Hour 0–2.5)

**Backend:**
- `POST /api/payments/initialize/` — creates a `Payment` row (`status=pending`), calls Paystack `transaction/initialize`, returns the `authorization_url` or Inline access code.
- `GET /api/payments/verify/:reference/` — calls Paystack `transaction/verify`, updates `Payment.status`, flips `Project.registration_status` to `confirmed` only on verified success.
- `POST /api/paystack/webhook/` — validates `x-paystack-signature` HMAC SHA512, handles `charge.success` as source of truth (independent of frontend callback).
- Add `PAYSTACK_SECRET_KEY` usage server-side only; confirm it never appears in any frontend bundle or network request from the browser.

**Frontend:**
- Registration form for software-track entries (team info + project details).
- Paystack Inline.js popup (`react-paystack` package optional, or vanilla script tag) using the **public** key only.
- Post-payment redirect handling → poll `verify/:reference/` → show confirmed state.

```bash
npm install react-paystack   # optional convenience wrapper, or use Paystack's vanilla inline.js via script tag
```

**Checkpoint:** Full registration → test-mode payment → webhook fires → `Project.registration_status` flips to `confirmed` → project now appears in the public voting grid. Use Paystack test cards, confirm both success and failure paths behave correctly.

---

### Stage 6: Judges' Portal (Hour 2.5–4.5)

**Backend:**
- Django auth (session or DRF Token) for judges — accounts pre-created via admin, no self-registration needed.
- `GET /api/judge/projects/` — projects in the judge's assigned category.
- `POST /api/judge/scores/` — per-criterion score submission, `unique_together` on `(judge, project, criterion)`.
- `EventSettings` singleton model with a `voting_closed` boolean; score submission endpoint checks this flag server-side before accepting writes.

**Frontend:**
- Simple login screen for judges.
- Score entry form per project (one row per criterion, editable until submission closes).
- Visual "submitted" vs "draft" state per project.

**Checkpoint:** Log in as a judge, submit/edit scores, confirm they persist and respect the uniqueness constraint (no double-scoring the same criterion).

---

### Stage 7: Real-Time Leaderboard (Hour 4.5–7)

**Backend:**
- Add `channels` routing (`asgi.py`), a `LeaderboardConsumer` that joins a `leaderboard` group.
- Django signal (`post_save` on `Vote` and `Score`) triggers a group broadcast with the recomputed leaderboard payload.
- Leaderboard calculation function: combine normalized audience votes + normalized judge scores per your agreed weighting (placeholder `0.4`/`0.6` until the committee confirms — see prior implementation plan's open questions).
- Cache the computed leaderboard in Redis with a short TTL (3–5s) so rapid vote bursts don't recompute on every single insert — debounce broadcasts.

Run with Daphne instead of the dev server once Channels is wired in:
```bash
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

**Frontend:**
- Dashboard route (`/dashboard`) — WebSocket connection, live-updating Recharts bar chart + ranked list.
- React Query polling fallback (e.g. every 10s) in case the WebSocket drops, so the TV screen never freezes silently.

**Checkpoint:** Open the dashboard in one tab, cast votes/submit scores in another, confirm the leaderboard updates live without a page refresh.

---

### Stage 8: Integration Pass + Cleanup (Hour 7–8)

- Walk all 5 screens end-to-end as if you were a real student: discover → verify → vote → (separately) register+pay → judge login/score → dashboard reflects everything.
- Check CORS, error states (network failure, invalid matric number, double vote, failed payment) all show sane messages instead of raw errors.
- Confirm `.env` secrets are gitignored, `DEBUG=False` path tested at least once, `ALLOWED_HOSTS` set correctly for wherever you'll deploy.

**End of Day 2 goal:** A demoable, deployable skeleton covering all 5 required screens, with the two highest-risk mechanics (duplicate voting, payment verification) proven under basic stress rather than just "looks right in the UI."

---

## Full Package Reference (copy-paste install blocks)

**Backend (`requirements.txt`)**
```
django
djangorestframework
django-cors-headers
psycopg2-binary
python-decouple
channels
channels-redis
daphne
requests
django-filter
```

**Frontend (`package.json` — key additions beyond Vite defaults)**
```
axios
react-router-dom
@tanstack/react-query
tailwindcss
postcss
autoprefixer
recharts
react-paystack   (optional — or use Paystack inline.js script tag directly)
```

**System (Ubuntu 22.04)**
```
postgresql
postgresql-contrib
redis-server
```

---

## What's Deliberately Out of Scope for These 2 Days

- Production deployment (Render/Railway/VPS setup) — separate task once the skeleton works locally.
- Real device/mobile browser testing across the student body's actual phones.
- Switching Paystack from test to live keys.
- Load testing at realistic event-day concurrency (the Day 1 stress test is a sanity check, not a load test).
- Final visual polish/branding — this roadmap prioritizes correctness of the voting/payment/scoring mechanics over UI finish.
