# KaushalSetu Cooperative Platform - Backend API

Production-grade FastAPI REST backend for **KaushalSetu**, empowering skilled local blue-collar workers and verified artisan cooperatives across India with AI dispatch, multi-factor smart matching, and transparent fee distribution.

---

## Architecture & Features

1. **Section 14 Statutory Fee Split**:
   - **85% Worker Net Disbursement**: Direct to worker bank/UPI.
   - **10% Cooperative Welfare Fund**: Dedicated reserve for community healthcare, accident cover, and tool loans.
   - **5% Platform Operations & Tech Maintenance**: Transparent platform commission.
2. **Smart Matching Engine**:
   - Haversine great-circle distance calculation.
   - Multi-criteria weighted scoring:
     - Trade skill relevance (30%)
     - Proximity & distance (25%)
     - Real-time availability (15%)
     - Customer rating & completed jobs (10%)
     - Document & cooperative verification (10%)
     - Years of field experience (10%)
3. **Full Job Lifecycle with OTP Verification**:
   - `requested` ➔ `accepted` ➔ `navigating` ➔ `arrived` ➔ `in_progress` ➔ `completed` (requires 4-digit customer OTP) ➔ `paid`.
4. **AI & Demand Intelligence**:
   - Natural language and voice query parsing with emergency breakdown detection.
   - Zone-level predictive demand surge forecasting for cooperative dispatch.
5. **Verification Audit Trail**:
   - Cooperative committee document verification (Govt Aadhaar, ITI trade badges, trade licenses).

---

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py              # Environment configuration & fee rates
│   ├── database.py            # SQLAlchemy engine, session & Base
│   ├── security.py            # Password hashing, JWT validation & role guards
│   ├── models.py              # Declarative database models (SQLite/PostgreSQL)
│   ├── schemas.py             # Pydantic v2 schemas matching frontend TypeScript types
│   ├── seed.py                # Initial database seed script (12 workers, 3 coops, 12 categories)
│   ├── main.py                # FastAPI app initialization, CORS, lifespan auto-seeder
│   ├── routers/
│   │   ├── auth.py            # User identity & role management
│   │   ├── workers.py         # Worker CRUD, registration, availability, documents
│   │   ├── cooperatives.py    # Cooperative societies, member rosters, welfare fund
│   │   ├── categories.py      # Trade categories & skills directory
│   │   ├── requests.py        # Service request state machine, OTP & fee calculation
│   │   ├── matching.py        # Smart ranking engine endpoint
│   │   ├── ai.py              # Request NLP parsing & demand forecasts
│   │   ├── reviews.py         # Customer ratings & reviews
│   │   ├── notifications.py   # Role-targeted notification feed
│   │   └── admin.py           # Platform GMV metrics, ledger audit, demo reset
│   └── services/
│       ├── fee_calculator.py  # Section 14 85/10/5 fee split
│       ├── matching.py        # Multi-factor smart ranking algorithm
│       ├── ai_parser.py       # Rule-based + Gemini AI request parser
│       └── demand_forecast.py # Predictive zone demand analytics
├── requirements.txt
├── test_backend.py            # Comprehensive automated integration test suite
└── kaushalsetu.db             # Optional SQLite database for local development
```

---

## Quickstart

### 1. Activate Python Environment & Install Dependencies

```powershell
cd backend
# Using existing virtual environment:
.\.venv\Scripts\activate
# Or install dependencies:
pip install -r requirements.txt
```

### 2. Configure PostgreSQL, JWT, and MSG91

Copy `.env.example` to `.env` and set the values before starting the API. PostgreSQL is the default database; SQLite is supported only when `DATABASE_URL` is explicitly changed for local tests.

### 3. Run the Development Server

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be live at:
- **API Base**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

### 4. Run Automated Integration Tests

```powershell
python test_backend.py
```

The authentication endpoints issue signed JWT Bearer tokens. Send them as `Authorization: Bearer <token>`; `/api/auth/me` and platform-admin reset operations enforce the token and role. OTP delivery requires valid MSG91 credentials and never returns the OTP in an API response.

---

## Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API root & statutory fee distribution split |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/categories` | List all 12 service categories with skills and base pricing |
| `GET` | `/api/workers` | Query workers (filter by `category`, `availability`, `cooperative_id`, `search`) |
| `GET` | `/api/workers/{id}` | Worker full profile with documents and verification status |
| `POST` | `/api/workers` | Register new worker trade profile |
| `PATCH` | `/api/workers/{id}/availability` | Toggle worker status (`available`, `busy`, `offline`) |
| `PATCH` | `/api/workers/{id}/documents/{doc_id}/verify` | Approve / reject worker KYC document |
| `GET` | `/api/cooperatives` | List all registered cooperative societies |
| `GET` | `/api/cooperatives/{id}/welfare-fund` | View cooperative 10% welfare fund pool & social security schemes |
| `POST` | `/api/matching/rank` | Multi-factor smart matching ranking nearby workers |
| `POST` | `/api/ai/parse-request` | AI voice/text service analysis with emergency detection |
| `GET` | `/api/ai/demand-forecast` | Zone-wise AI demand surge advisories |
| `GET` | `/api/requests` | List service requests / jobs |
| `POST` | `/api/requests` | Create new service request with auto 85/10/5 fee split & 4-digit OTP |
| `PATCH` | `/api/requests/{id}/status` | Update job lifecycle (`accepted`, `arrived`, `completed` with OTP, `paid`) |
| `GET` | `/api/reviews` | List customer reviews & ratings |
| `POST` | `/api/reviews` | Submit new customer rating (updates worker cumulative rating) |
| `GET` | `/api/notifications` | Fetch notifications filtered by role or user ID |
| `GET` | `/api/admin/metrics` | Platform-wide financial ledger, GMV volume, and cooperative welfare pool |
| `POST` | `/api/admin/reset-demo` | Reset database and reseed default demonstration data |
