<p align="center">
  <h1 align="center"><img src="frontend/public/logo.png" alt="Fundify Logo" width="40" style="vertical-align: middle;" /> Fundify</h1>
  <p align="center">
    <strong>DEVELOPERS - Kushal B K & Bhuvan Rai</strong>
    <br/>
    <strong>AI-Powered Personal Finance Intelligence Platform</strong>
  </p>
  <p align="center">
    A full-stack fintech application that combines deterministic financial analytics with<br/>
    AI-powered advisory using RAG (Retrieval-Augmented Generation) and Google Gemini.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini_AI-Google-4285F4?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/ChromaDB-Vector_Store-FF6F00" alt="ChromaDB" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [API Endpoints](#-api-endpoints)
  - [Backend API (Express)](#backend-api-express--apiv1)
  - [Model API (FastAPI)](#model-api-fastapi)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Scripts & Commands](#-scripts--commands)

---

## 🔭 Overview

**Fundify** is an intelligent personal finance platform that helps users understand, analyze, and optimize their financial health. It goes beyond basic budgeting by providing:

- **Deterministic financial scoring** — A transparent, auditable 0–100 health score with no black-box AI
- **AI-powered financial advisory** — Personalized chatbot backed by RAG over RBI guidelines and financial documents
- **Advanced analytics** — Net worth tracking, goal feasibility calculations, portfolio alignment, and stress testing
- **Comprehensive data management** — Full CRUD for incomes, expenses, assets, liabilities, insurances, and financial goals

---

## 🏗 Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────────────┐
│                  │     │                  │     │                          │
│    Frontend      │────▶│    Backend       │────▶│    Model (AI/ML)         │
│  React + Vite    │     │  Express + Mongo │     │  FastAPI + Gemini + RAG  │
│  Port: 5173      │     │  Port: 5000      │     │  Port: 8000              │
│                  │     │                  │     │                          │
└──────────────────┘     └──────────────────┘     └──────────────────────────┘
        UI                  Auth, CRUD,              Score Engine,
     Dashboard              Data Relay               Analytics Engine,
     Chatbot                JWT + Cookies             Stress Simulation,
     Onboarding             OTP Email Flow            RAG Pipeline (ChromaDB)
                                                      Google Gemini LLM
```

The system follows a **three-tier architecture**:

1. **Frontend** — Single-page React app with protected routes, multi-step onboarding, and a real-time financial dashboard
2. **Backend** — REST API that handles authentication, user data persistence, and proxies financial analysis requests to the model service
3. **Model** — Python-based AI/ML microservice with versioned APIs (`v1`, `v2`, `v3`) for scoring, analytics, simulation, and RAG-based chat

---

## ✨ Features

### 🔐 Authentication & Security

- **Email verification** with OTP (via Nodemailer)
- **JWT-based auth** stored in HTTP-only cookies
- **Forgot password** flow with 3-step OTP verification
- **Protected routes** on both frontend and backend
- **Secure password hashing** with bcrypt

### 📊 Financial Health Score (0–100)

A fully deterministic, auditable score calculated across **5 dimensions**:

| Component          | Max Points | What It Measures                        |
| ------------------ | :--------: | --------------------------------------- |
| Savings Rate       |     25     | Income vs. expenses ratio               |
| Emergency Fund     |     20     | Liquid assets vs. monthly expenses      |
| Debt Ratio         |     20     | EMI burden + credit card penalty        |
| Diversification    |     15     | Unique asset types in portfolio         |
| Insurance Coverage |     20     | Term coverage relative to annual income |

### 📈 Analytics Engine

- **Net Worth Analysis** — Total assets vs. liabilities, liquidity ratio, asset allocation percentages, debt-to-asset ratio
- **Goal Feasibility** — Per-goal SIP calculation, funding gap analysis, goal risk assessment, feasibility flag
- **Portfolio Alignment** — Risk profile vs. actual asset allocation comparison

### 🧪 Stress Testing

Simulates **3 adverse scenarios** (pure math, no LLM):

- 🔴 **Recession** — Market downturn impact on portfolio
- 🟠 **Job Loss** — Income disruption analysis
- 🟡 **Rate Hike** — Interest rate increase on liabilities

### 🤖 AI-Powered Chatbot

- **RAG Pipeline** — Retrieves relevant context from financial documents (RBI guidelines, personal finance PDFs)
- **Google Gemini** integration for natural language responses
- **Personalized answers** — Injects user's full financial profile into the prompt
- **Conversation history** — Compressed and persisted for context continuity
- **ChromaDB** vector store for document embeddings

### 💼 Financial Data Management

Full **CRUD operations** for:

- 💵 Incomes (salary, freelance, etc.)
- 💸 Expenses (fixed, variable categories)
- 🏠 Assets (stocks, mutual funds, crypto, FDs, real estate, gold)
- 🏦 Liabilities (loans, credit cards)
- 🛡️ Insurances (term, health, vehicle, life)
- 🎯 Financial Goals (with inflation-adjusted targets)

### 🎨 Frontend Experience

- **Landing page** with Hero, Features, Stats, and CTA sections
- **Multi-step onboarding** (email verification → registration → financial profile)
- **Interactive dashboard** with real-time analytics
- **Dark mode** with smooth transitions
- **GSAP animations** for engaging UI
- **Responsive design** with TailwindCSS v4

---

## 🛠 Tech Stack

### Frontend

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| React 19          | UI framework            |
| Vite 7            | Build tool & dev server |
| TailwindCSS 4     | Utility-first styling   |
| React Router 7    | Client-side routing     |
| Axios             | HTTP client             |
| GSAP              | Animations              |
| ESLint + Prettier | Code quality            |

### Backend

| Technology    | Purpose                     |
| ------------- | --------------------------- |
| Express 5     | REST API framework          |
| MongoDB       | Database (via Mongoose 9)   |
| JWT           | Authentication tokens       |
| bcrypt        | Password hashing            |
| Nodemailer    | OTP email delivery          |
| cookie-parser | HTTP-only cookie management |
| Axios         | Model service communication |

### Model (AI/ML)

| Technology       | Purpose                |
| ---------------- | ---------------------- |
| FastAPI          | High-performance API   |
| Google Gemini AI | LLM for RAG responses  |
| ChromaDB         | Vector database        |
| Pydantic v2      | Schema validation      |
| PyPDF            | PDF document ingestion |
| Loguru           | Structured logging     |
| Uvicorn          | ASGI server            |
| Docker           | Containerization       |

---

## 📁 Folder Structure

```
Fundify/
├── .gitignore
├── README.md
│
├── frontend/                          # React SPA (Vite)
│   ├── index.html                     # Entry HTML
│   ├── package.json                   # Dependencies & scripts
│   ├── vite.config.js                 # Vite configuration
│   ├── eslint.config.js               # ESLint rules
│   ├── public/                        # Static assets
│   ├── dist/                          # Production build output
│   └── src/
│       ├── main.jsx                   # React entry point
│       ├── App.jsx                    # Root component & routing
│       ├── App.css                    # Global styles
│       ├── index.css                  # Tailwind base & design tokens
│       ├── assets/                    # Images, icons, fonts
│       ├── context/
│       │   └── AuthContext.jsx        # Auth state (user, login, logout, onboarding)
│       ├── services/
│       │   ├── axiosInstance.js        # Preconfigured Axios with base URL & cookies
│       │   ├── authServices.js         # Login, register, verify, forgot password
│       │   ├── userServices.js         # CRUD for financial data
│       │   └── modelServices.js        # Score, analytics, simulation, chatbot calls
│       ├── components/
│       │   ├── Navbar.jsx              # Public navigation bar
│       │   ├── DashboardNavbar.jsx     # Authenticated navigation bar
│       │   ├── Footer.jsx              # Site footer
│       │   ├── Loader.jsx              # Loading spinner
│       │   ├── auth/
│       │   │   ├── ProtectedRoute.jsx  # Route guard (auth + onboarding check)
│       │   │   ├── AuthHeader.jsx      # Auth page header
│       │   │   ├── AuthFooter.jsx      # Auth page footer
│       │   │   ├── AuthSimpleHeader.jsx
│       │   │   ├── AuthSimpleFooter.jsx
│       │   │   ├── AuthSupportHeader.jsx
│       │   │   └── AuthOnboardingHeader.jsx
│       │   ├── landing/
│       │   │   ├── Hero.jsx            # Hero section with animations
│       │   │   ├── Features.jsx        # Feature showcase cards
│       │   │   ├── Stats.jsx           # Platform statistics
│       │   │   └── CTA.jsx             # Call-to-action section
│       │   └── signup/
│       │       └── ...                 # Signup step components
│       └── pages/
│           ├── Landing.jsx             # Landing page layout
│           ├── Login.jsx               # Login form with validation
│           ├── Signup.jsx              # Signup entry point
│           ├── Signup1.jsx             # Step 1: Email verification
│           ├── Signup2.jsx             # Step 2: OTP verification
│           ├── Signup3.jsx             # Step 3: Financial onboarding
│           ├── Dashboard.jsx           # Main dashboard with analytics
│           ├── Profile.jsx             # User profile management
│           ├── ChatBot.jsx             # AI financial advisor chat
│           ├── LegalPrivacy.jsx        # Privacy policy page
│           ├── TermsAndConditions.jsx  # Terms of service page
│           ├── ForgotPassword.jsx      # Password reset page
│           ├── VerifyEmail.jsx         # Email verification page
│           ├── VerifyOtp.jsx           # OTP verification page
│           └── Home.jsx                # Home redirect
│
├── backend/                           # Express.js REST API
│   ├── server.js                      # Server entry point (port 5000)
│   ├── app.js                         # Express app setup (CORS, routes, middleware)
│   ├── package.json                   # Dependencies & scripts
│   ├── config/
│   │   └── db.js                      # MongoDB connection (Mongoose)
│   ├── routes/
│   │   ├── authRoutes.js              # Auth endpoints (/api/v1/auth/*)
│   │   ├── userRoutes.js              # User data endpoints (/api/v1/user/*)
│   │   └── modelRoutes.js             # Model proxy endpoints (/api/v1/*)
│   ├── controllers/
│   │   ├── authController.js          # Auth logic (register, login, OTP, password)
│   │   ├── userController.js          # CRUD for all financial entities
│   │   └── modelController.js         # Proxies requests to FastAPI model service
│   ├── middlewares/
│   │   ├── userAuth.js                # JWT verification middleware
│   │   ├── error.js                   # Global error handler
│   │   └── handleAsyncError.js        # Async error wrapper
│   ├── models/
│   │   ├── userModel.js               # User schema (profile, preferences)
│   │   ├── tempUserModel.js           # Temporary user for email verification
│   │   ├── assetModel.js              # Asset schema
│   │   ├── expenseModel.js            # Expense schema
│   │   ├── incomeModel.js             # Income schema
│   │   ├── liabilityModel.js          # Liability schema
│   │   ├── insuranceModel.js          # Insurance schema
│   │   ├── financialGoalModel.js      # Financial goal schema
│   │   ├── financialHealthScoreModel.js # Cached health score
│   │   └── data.json                  # Seed/test data
│   └── utils/
│       ├── jwtToken.js                # JWT sign & cookie helper
│       ├── generateOtp.js             # OTP generation utility
│       ├── sendEmail.js               # Nodemailer email sender
│       └── handleError.js             # Custom error class
│
└── model/                             # FastAPI AI/ML Microservice
    ├── Dockerfile                     # Docker container config
    ├── pyproject.toml                 # Python project metadata
    ├── requirements.txt               # Python dependencies
    ├── data/
    │   ├── raw/                       # Source documents for RAG
    │   │   ├── FAME202426022024.pdf   # FAME India guidelines
    │   │   ├── GUIDE310113_F.pdf      # Financial planning guide
    │   │   ├── I Can Do_RBI.pdf       # RBI financial literacy
    │   │   ├── Personal finance.pdf   # Personal finance handbook
    │   │   └── rbi_kyc.txt            # RBI KYC norms
    │   └── chromadb/                  # Persisted vector embeddings
    ├── scripts/
    │   ├── ingest_docs.py             # Document ingestion pipeline
    │   ├── run_tests.py               # Basic test runner
    │   ├── run_all_tests.py           # Comprehensive test suite
    │   └── test_v3.py                 # V3 API tests
    └── app/
        ├── main.py                    # FastAPI app factory & router registration
        ├── core/
        │   ├── config.py              # Settings (env vars, API keys, DB paths)
        │   └── logging.py             # Loguru setup
        ├── models/
        │   ├── score_schema.py        # Pydantic schemas (CamelCase ↔ snake_case)
        │   └── user_schema.py         # User-based retrieval schemas
        ├── api/
        │   ├── v1/
        │   │   ├── api.py             # V1 router (health, rag, score, analytics, simulate)
        │   │   └── endpoints/
        │   │       ├── health.py      # GET  /api/v1/health
        │   │       ├── score.py       # POST /api/v1/score/financial-health
        │   │       ├── analytics.py   # POST /api/v1/analytics/*
        │   │       ├── simulate.py    # POST /api/v1/simulate/stress-test
        │   │       ├── rag.py         # POST /api/v1/rag/ask & /retrieve
        │   │       └── user_retrieval.py  # Personalized RAG endpoint
        │   ├── v2/
        │   │   └── api.py             # V2 router (user-based-retrieval)
        │   └── v3/
        │       └── api.py             # V3 router (analytics + simulate)
        ├── services/
        │   ├── engines/
        │   │   ├── net_worth.py       # Net worth computation engine
        │   │   ├── goal_engine.py     # Goal feasibility (SIP, gap analysis)
        │   │   ├── portfolio_engine.py # Portfolio alignment checker
        │   │   └── stress_engine.py   # Stress test simulator
        │   ├── rag/
        │   │   └── pipeline.py        # RAG pipeline (query → retrieve → generate)
        │   ├── embedding/
        │   │   ├── base.py            # Abstract embedding interface
        │   │   └── gemini.py          # Google Gemini embeddings
        │   ├── llm/
        │   │   └── gemini.py          # Gemini LLM client (generation + history)
        │   └── ingestion/
        │       └── ...                # Document chunking & ingestion
        └── infrastructure/
            └── vectordb/              # ChromaDB client & collection manager
```

---

## 🔌 API Endpoints

### Backend API (Express) — `/api/v1`

#### 🔐 Authentication — `/api/v1/auth`

| Method | Endpoint                           | Auth | Description                             |
| ------ | ---------------------------------- | ---- | --------------------------------------- |
| POST   | `/auth/verify-email`               | ❌   | Send OTP to email for verification      |
| POST   | `/auth/verify-otp`                 | ❌   | Verify OTP → mark email verified        |
| POST   | `/auth/register`                   | ❌   | Register user (requires verified email) |
| POST   | `/auth/login`                      | ❌   | Login → sets JWT cookie                 |
| GET    | `/auth/logout`                     | ❌   | Clear auth cookie                       |
| POST   | `/auth/forgot-password`            | ❌   | Send password reset OTP                 |
| POST   | `/auth/forgot-password/verify-otp` | ❌   | Verify password reset OTP               |
| POST   | `/auth/forgot-password/reset`      | ❌   | Set new password                        |
| GET    | `/auth/me`                         | ✅   | Get authenticated user profile          |
| POST   | `/auth/change-password`            | ✅   | Change password (authenticated)         |

#### 👤 User Data — `/api/v1/user`

| Method | Endpoint                         | Auth | Description                   |
| ------ | -------------------------------- | ---- | ----------------------------- |
| GET    | `/user/onboarding-status/:email` | ❌   | Check onboarding completion   |
| PATCH  | `/user/onboarding-step`          | ✅   | Mark onboarding step complete |
| GET    | `/user/me`                       | ✅   | Get user profile              |
| PUT    | `/user/me`                       | ✅   | Update user profile           |
| GET    | `/user/financial-health-score`   | ✅   | Get cached health score       |

##### Financial Entities (CRUD) — All require authentication ✅

| Entity          | GET (List)              | POST (Create)          | PUT (Update)               | DELETE                     |
| --------------- | ----------------------- | ---------------------- | -------------------------- | -------------------------- |
| **Assets**      | `/user/assets`          | `/user/asset`          | `/user/asset/:id`          | `/user/asset/:id`          |
| **Expenses**    | `/user/expenses`        | `/user/expense`        | `/user/expense/:id`        | `/user/expense/:id`        |
| **Incomes**     | `/user/incomes`         | `/user/income`         | `/user/income/:id`         | `/user/income/:id`         |
| **Liabilities** | `/user/liabilities`     | `/user/liability`      | `/user/liability/:id`      | `/user/liability/:id`      |
| **Insurances**  | `/user/insurances`      | `/user/insurance`      | `/user/insurance/:id`      | `/user/insurance/:id`      |
| **Goals**       | `/user/financial-goals` | `/user/financial-goal` | `/user/financial-goal/:id` | `/user/financial-goal/:id` |

#### 🤖 Model Proxy — `/api/v1`

| Method | Endpoint                         | Auth | Description                             |
| ------ | -------------------------------- | ---- | --------------------------------------- |
| GET    | `/health`                        | ❌   | Model service health check              |
| POST   | `/rag/ask`                       | ✅   | Ask a financial question (RAG)          |
| POST   | `/rag/retrieve`                  | ✅   | Retrieve relevant document chunks       |
| POST   | `/score/financial-health`        | ✅   | Calculate financial health score        |
| POST   | `/analytics/net-worth`           | ✅   | Net worth analysis                      |
| POST   | `/analytics/goal-feasibility`    | ✅   | Goal feasibility calculation            |
| POST   | `/analytics/portfolio-alignment` | ✅   | Portfolio vs. risk profile alignment    |
| POST   | `/simulate/stress-test`          | ✅   | Run stress test simulation              |
| POST   | `/user-based-retrieval`          | ✅   | Personalized AI chatbot (RAG + profile) |

---

### Model API (FastAPI)

#### V1 — `/api/v1`

| Method | Endpoint                                | Description                                      |
| ------ | --------------------------------------- | ------------------------------------------------ |
| GET    | `/api/v1/health/`                       | Service health check                             |
| POST   | `/api/v1/rag/ask`                       | RAG-powered Q&A with conversation history        |
| POST   | `/api/v1/rag/retrieve`                  | Retrieve relevant context chunks from vector DB  |
| POST   | `/api/v1/score/financial-health`        | Deterministic financial health score (0–100)     |
| POST   | `/api/v1/analytics/net-worth`           | Net worth, liquidity ratio, allocation breakdown |
| POST   | `/api/v1/analytics/goal-feasibility`    | Per-goal SIP, gap, risk, and feasibility         |
| POST   | `/api/v1/analytics/portfolio-alignment` | Risk profile vs. actual asset allocation         |
| POST   | `/api/v1/simulate/stress-test`          | Recession / Job Loss / Rate Hike simulations     |

#### V2 — `/api/v2`

| Method | Endpoint                        | Description                                  |
| ------ | ------------------------------- | -------------------------------------------- |
| POST   | `/api/v2/user-based-retrieval/` | Personalized RAG with full financial profile |

#### V3 — `/api/v3`

| Method | Endpoint                                | Description                 |
| ------ | --------------------------------------- | --------------------------- |
| POST   | `/api/v3/analytics/net-worth`           | Net worth analysis (V3)     |
| POST   | `/api/v3/analytics/goal-feasibility`    | Goal feasibility (V3)       |
| POST   | `/api/v3/analytics/portfolio-alignment` | Portfolio alignment (V3)    |
| POST   | `/api/v3/simulate/stress-test`          | Stress test simulation (V3) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.11
- **MongoDB** (local or Atlas)
- **Google Gemini API Key**

### 1. Clone the Repository

```bash
git clone https://github.com/kushalkambar5/fundify.git
cd fundify
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env        # Configure your environment variables
npm run dev                  # Starts on port 5000
```

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env        # Set VITE_API_URL
npm run dev                  # Starts on port 5173
```

### 4. Setup Model Service

```bash
cd model
python -m venv .venv
.venv\Scripts\activate              # Windows
# source .venv/bin/activate         # macOS/Linux
pip install -r requirements.txt

# Ingest documents into ChromaDB (first time only)
python scripts/ingest_docs.py

# Start the server
uvicorn app.main:app --reload --port 8000
```

#### Or use Docker:

```bash
cd model
docker build -t fundify-model .
docker run -p 8000:8000 --env-file .env fundify-model
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fundify
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:5173
MODEL_URL=http://localhost:8000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Model (`model/.env`)

```env
GEMINI_API_KEY=your_google_gemini_api_key
CHROMA_PERSIST_DIRECTORY=data/chromadb
CHROMA_COLLECTION_NAME=finance-rag
BACKEND_CORS_ORIGINS=http://localhost:5000,http://localhost:5173
```

---

## 📜 Scripts & Commands

### Backend

| Command       | Description                     |
| ------------- | ------------------------------- |
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start`   | Start production server         |

### Frontend

| Command           | Description               |
| ----------------- | ------------------------- |
| `npm run dev`     | Start Vite dev server     |
| `npm run build`   | Production build          |
| `npm run preview` | Preview production build  |
| `npm run lint`    | Run ESLint                |
| `npm run format`  | Format code with Prettier |

### Model

| Command                                     | Description                  |
| ------------------------------------------- | ---------------------------- |
| `uvicorn app.main:app --reload --port 8000` | Start with auto-reload       |
| `python scripts/ingest_docs.py`             | Ingest PDFs into ChromaDB    |
| `python scripts/run_tests.py`               | Run basic API tests          |
| `python scripts/run_all_tests.py`           | Run comprehensive test suite |
| `python scripts/test_v3.py`                 | Run V3 API tests             |

---

## ⚙️ Key Capabilities

- **Conversational Memory** — Follow-ups auto-rewritten into standalone queries; LLM compresses history into a dense ≤200-word memory string per turn
- **Personalized RAG** — Real financial numbers injected into the prompt for grounded, user-specific advice
- **Deterministic Engines** — All scoring, analytics, and simulation endpoints use pure math — no LLM, fully auditable
- **Dynamic Token Budgeting** — Simple queries capped at 50 tokens; complex queries up to 1000 tokens
- **Rate-Limit Resilience** — Exponential backoff with retry on all Gemini API calls
- **Dual Input Format** — All models accept both `camelCase` (frontend) and `snake_case` (Python-native)

---

<p align="center">
  Made with ❤️ by the Fundify Team
</p>
