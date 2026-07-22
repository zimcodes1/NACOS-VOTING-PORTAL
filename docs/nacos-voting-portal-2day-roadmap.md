# NACOS Software Exhibition — 2-Day Build Roadmap

**Naming:** this system is the **"NACOS Software Exhibition"** — use that exact name in page titles, the Django project's `verbose_name`, browser tab titles, and any prompts you feed to an AI code-gen tool while scaffolding, so it doesn't get generated as or confused with a generic "student/voting portal."

Scope note: 2 days gets you a working skeleton with all 5 screens wired to real endpoints and DB constraints enforced. Payment collection is manual (see Stage 5) — no gateway integration, which frees up real time versus the original plan. Treat Day 2 evening as a checkpoint, not a finish line — real device testing should happen after this roadmap, with buffer before the actual event.

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
    django-filter

django-admin startproject config .
python manage.py startapp core        # projects, categories, votes, payments (manual)
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
| `django-filter` | Category/search filtering on project list endpoint |

*(No `requests` package needed for now — that was for server-side Paystack API calls. Add it back later if you reintroduce a payment gateway.)*

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
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**End of Stage 1 checkpoint:** `python manage.py runserver` and `npm run dev` both boot cleanly, empty pages, no errors.

---

### Stage 2: Models + Admin (Hour 1–3)

- Write all models from the data model spec: `Category`, `Project` (with `registration_code`, `contact_name`, `contact_email`, `contact_phone`, `show_contact_publicly`), `Payment` (manual-tracking fields: `status`, `confirmed_by`, `confirmed_at`, `payment_method`, `notes`), `Voter`, `Vote` — all in `core` — plus `Judge`, `ScoreCriterion`, `Score` in `judging`.
- Add a `save()` override or a `pre_save` signal on `Project` that generates `registration_code` once, on first save only (format `NSE26-XXXX` — see implementation plan section 4.1). Test it generates a unique code even if two registrations save in the same second.
- Add the `unique_together = ("matric_number", "category")` constraint on `Vote` immediately — this is the highest-risk rule, get it into a migration on day 1.
- Register everything in `admin.py` for each app with sensible `list_display` (organizers will live in this admin panel to enter projects) — make sure `registration_code` and `contact_email`/`contact_phone` are visible columns so organizers can quickly look up or contact a team without opening each record.
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

## DAY 2 — Registration, Judging, Real-Time Dashboard

Cutting the payment gateway frees up roughly half a day versus the original plan — that time is folded into Stage 6 (Judges' Portal) and Stage 7 (Dashboard) below, plus a slightly longer Stage 8 cleanup pass at the end.

### Stage 5: Registration Form + Manual Payment Approval (Hour 0–1.5)

**Backend:**
- `POST /api/register-project/` — creates the `Project` row (`registration_status=pending_payment`, or straight to `confirmed` if `Category.requires_payment` is `False`) plus its related `Payment` row (`status=pending`, or `status=waived` for fee-free categories). Generates `registration_code` on save (built in Stage 2).
- `GET /api/lookup-project/?code=&email=` — lets a team look up their own project status later using their `registration_code` + `contact_email`, without needing a login system.
- No payment endpoints needed — an organizer confirms payment directly in `/admin/` by finding the project and flipping `Payment.status` to `confirmed`. Wire up the `post_save` signal on `Payment` (also built in Stage 2 as part of the model, or here if you deferred it) that flips `Project.registration_status` to `confirmed` automatically when `Payment.status` becomes `confirmed`.

**Frontend:**
- Registration form (team info + project details + `contact_name`/`contact_email`/`contact_phone` + `show_contact_publicly` checkbox).
- On successful submit: show the assigned `registration_code` prominently, plus payment instructions (account details/whatever the department is using) telling the team to quote the code as their transfer narration. Tell them to save the code — it's how they'll check their status later.
- A simple "Check my registration status" page: input `registration_code` + `contact_email` → shows current status (pending/confirmed).

**Checkpoint:** Register a test project → confirm it shows `pending_payment` and does *not* appear in the public grid yet → go into `/admin/`, mark its `Payment` as `confirmed` → confirm the project flips to `confirmed` and now appears on the public Home grid.

---

### Stage 6: Judges' Portal (Hour 1.5–4)

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

### Stage 7: Real-Time Leaderboard (Hour 4–7)

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

- Walk all 5 screens end-to-end as if you were a real student: discover → verify → vote → (separately) register → check status pending → get manually confirmed via admin → appears in grid → judge login/score → dashboard reflects everything.
- Check CORS, error states (network failure, invalid matric number, double vote, project not found on status lookup) all show sane messages instead of raw errors.
- Confirm `.env` secrets are gitignored, `DEBUG=False` path tested at least once, `ALLOWED_HOSTS` set correctly for wherever you'll deploy.

**End of Day 2 goal:** A demoable, deployable skeleton covering all 5 required screens, with the highest-risk mechanic (duplicate voting) proven under basic stress rather than just "looks right in the UI," and the registration→manual-confirm→public-visibility chain working cleanly end to end.

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
- Any payment gateway integration — payment is fully manual for now (see Stage 5); revisit only if registration volume outgrows manual reconciliation.
- Load testing at realistic event-day concurrency (the Day 1 stress test is a sanity check, not a load test).
- Final visual polish/branding — this roadmap prioritizes correctness of the voting/registration/scoring mechanics over UI finish.
