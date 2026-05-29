# Voice of Law — Project Documentation

Legal case management and AI assistant platform for lawyers. This repository contains a **React SPA** (`Client/`) and a **Node.js REST API** (`server/`) backed by **MongoDB**.

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Repository Layout](#repository-layout)
5. [Frontend Structure](#frontend-structure)
6. [Backend Structure](#backend-structure)
7. [API Routes](#api-routes)
8. [Database Models](#database-models)
9. [Authentication Flow](#authentication-flow)
10. [Environment Variables](#environment-variables)
11. [Running Locally](#running-locally)
12. [Design Notes](#design-notes)

---

## Product Overview

| Area | Purpose |
|------|---------|
| **Auth & profiles** | Register/login (JWT), lawyer profile, onboarding, photo upload |
| **Cases** | CRUD, status, hearings, notes, file uploads per case |
| **AI** | Legal chat assistant (Google Generative AI), conversation history |
| **Drafting** | Legal drafts + templates (Handlebars), PDF export |
| **Library** | Legal books/PDFs for authenticated users |
| **Calendar** | Events + sync from case hearing dates |
| **Notifications** | In-app notifications + Socket.io (real-time capable) |
| **Admin** | Users, library, templates, announcements, audit logs |
| **Subscription** | Trial/premium flags on user (Stripe on frontend) |
| **Public site** | Marketing pages, articles, contact, FAQ |

---

## Technology Stack

### Frontend (`Client/`)

| Technology | Version / Role |
|------------|----------------|
| React | 19 — UI framework |
| Vite | 5 — dev server & production build |
| React Router | 7 — client-side routing |
| Tailwind CSS | 4 — styling (`@tailwindcss/vite`) |
| Framer Motion | Page/component animations |
| Axios | HTTP client to `/api/v1` |
| Lucide React + React Icons | Icons |
| Stripe | Subscription payments UI |

### Backend (`server/`)

| Technology | Role |
|------------|------|
| Node.js | ≥18 runtime |
| Express | 4 — REST API |
| MongoDB + Mongoose | 8 — database & ODM |
| JWT + bcryptjs | Authentication |
| Passport Google OAuth | Optional social login |
| Socket.io | Real-time events |
| Multer + Cloudinary | File uploads |
| Google Generative AI | AI chat |
| Handlebars + html-pdf-node | Draft templates / PDF |
| Winston, Morgan, Helmet, express-rate-limit | Logging, security, rate limits |
| node-cron | Scheduled reminder jobs |

---

## Architecture

```
┌─────────────────────┐         HTTP /api/v1          ┌─────────────────────┐
│  Client (Vite/React)│  ──────────────────────────►  │  server (Express)   │
│  - App.jsx          │         JWT Bearer token        │  - routes/index.js  │
│  - AuthContext      │                                 │  - controllers      │
│  - services/api.js  │  ◄──────────────────────────  │  - models (Mongoose)│
└─────────────────────┘         JSON responses          └──────────┬──────────┘
                                                                   │
                                                                   ▼
                                                          ┌─────────────────┐
                                                          │    MongoDB      │
                                                          └─────────────────┘
```

**Request flow:** Browser → React components → `api.js` (Axios) → Express middleware (auth, rate limit) → controller → Mongoose model → MongoDB.

---

## Repository Layout

```
New folder/
├── Client/                    # React frontend (main UI)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env                   # VITE_API_URL
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       ├── pages/
│       ├── User/
│       ├── Admin/
│       ├── components/
│       ├── services/
│       ├── hooks/
│       └── styles/
├── server/                    # Node/Express API
│   ├── server.js              # Entry point
│   ├── package.json
│   ├── .env                   # MONGO_URI, JWT_SECRET, etc.
│   ├── uploads/               # Local file uploads
│   └── src/
│       ├── app.js
│       ├── routes/
│       ├── controllers/
│       ├── models/
│       ├── middleware/
│       ├── config/
│       ├── services/
│       ├── jobs/
│       └── validators/
└── README.md                  # This file
```

---

## Frontend Structure

### Entry & routing

| File | Role |
|------|------|
| `Client/src/main.jsx` | React application entry (`StrictMode`) |
| `Client/src/index.css` | Tailwind v4 theme + global styles |
| `Client/src/App.jsx` | Route definitions, `AuthProvider` |
| `Client/src/context/AuthContext.jsx` | Login/logout, user state, localStorage |
| `Client/src/components/ProtectedRoute.jsx` | Auth gate; optional admin-only |

### Public pages (`Client/src/pages/`)

- `Home.jsx`, `About.jsx`, `Contact.jsx`, `Features.jsx`, `Pricing.jsx`
- `FaqPage.jsx`, `AnnouncementsPage.jsx`, `AllArticles.jsx`, `DetailPage.jsx`
- `EnhancedAuthPage.jsx` — `/auth/login`, `/auth/register`
- `SubscriptionPage.jsx`

### User dashboard (`Client/src/User/`)

**Shell:** `User/UserPanel.jsx` — sidebar, header, notifications, nested routes.

| Route | Component |
|-------|-----------|
| `/user-panel` | Dashboard home (profile card + dashboard content + articles) |
| `/user-panel/chatbot` | `components/AssistantAi/Chatbot.jsx` |
| `/user-panel/cases` | `User/Case/MyCases.jsx` |
| `/user-panel/cases/add` | `User/Case/AddCase.jsx` |
| `/user-panel/cases/edit` | `User/Case/EditCase.jsx` |
| `/user-panel/cases/:caseId` | `User/Case/CaseDetails.jsx` |
| `/user-panel/library` | `User/LegalLibrary/LegalLibrary.jsx` |
| `/user-panel/drafting` | `User/Drafting/LegalDraftingPage.jsx` |
| `/user-panel/vault` | `User/DocumentVault/DocumentVault.jsx` |
| `/user-panel/notepad` | `User/Notepad/Notepad.jsx` |
| `/user-panel/articles` | `components/Articles/DashboardFeed.jsx` |
| `/user-panel/calendar` | `components/user-panel/LawyerCalendarPage.jsx` |
| `/user-panel/settings` | `User/Setting/Settings.jsx` |
| `/user-panel/jotform-agent` | `User/JotformAgent.jsx` |

**Key shared components:**

- `components/user-panel/DashboardProfileCard.jsx`
- `components/user-panel/NotificationPopover.jsx`
- `components/OnboardingGuard.jsx` + `OnboardingForm.jsx`
- `hooks/useSubscriptionCheck.js`
- `services/subscriptionStatus.js`
- `components/SubscriptionBlocker.jsx`

### Admin (`Client/src/Admin/`)

| Route | File |
|-------|------|
| `/dashboard` | `Admin/Dashboard.jsx` |
| `/admin/payments` | `components/Admin/PaymentVerification.jsx` |

### API client (`Client/src/services/`)

| File | Role |
|------|------|
| `api.js` | Axios instance, all API modules (`authAPI`, `userAPI`, `casesAPI`, etc.) |
| `subscriptionStatus.js` | Subscription flags from user profile |
| `ArticleService.js` | Articles/blog helpers |

---

## Backend Structure

### Entry points

| File | Role |
|------|------|
| `server/server.js` | Connects DB, Socket.io, cron jobs, listens on PORT (default 5000) |
| `server/src/app.js` | Express app: CORS, helmet, rate limit, `/api/v1`, health check |

### Routes (base: `/api/v1`)

| Mount | File | Purpose |
|-------|------|---------|
| `/auth` | `auth.routes.js` | Register, login, me, Google OAuth |
| `/users` | `user.routes.js` | Profile, picture, password |
| `/cases` | `case.routes.js` | Case CRUD, stats, status, notes |
| `/cases` | `evidence.routes.js` | Case evidence files |
| `/ai` | `ai.routes.js` | Chat, conversations |
| `/drafts` | `draft.routes.js` | Drafts, generate, export |
| `/library` | `library.routes.js` | Legal books |
| `/calendar` | `calendar.routes.js` | Events, sync hearings |
| `/notifications` | `notification.routes.js` | Notifications |
| `/admin` | `admin.routes.js` | Admin dashboard & management |
| `/jotform-ai` | `jotformAi.js` | Jotform AI proxy |

### Controllers (`server/src/controllers/`)

`authController`, `userController`, `caseController`, `evidenceController`, `aiController`, `draftController`, `libraryController`, `calendarController`, `notificationController`, `adminController`

### Middleware (`server/src/middleware/`)

- `auth.js` — JWT verification
- `admin.js` — Admin role check
- `rateLimiter.js` — Request throttling
- `upload.js` — File upload (Multer/Cloudinary)
- `errorHandler.js` — Global errors

---

## Database Models

| Model | File | Purpose |
|-------|------|---------|
| User | `models/User.js` | Account, subscription, profile, onboarding |
| Case | `models/Case.js` | Legal cases (client, court, parties, status) |
| Evidence | `models/Evidence.js` | Case evidence attachments |
| Conversation | `models/Conversation.js` | AI chat history |
| Draft | `models/Draft.js` | Legal drafts |
| DraftTemplate | `models/DraftTemplate.js` | Admin templates |
| Book | `models/Book.js` | Legal library |
| CalendarEvent | `models/CalendarEvent.js` | Calendar |
| Notification | `models/Notification.js` | User notifications |
| AuditLog | `models/AuditLog.js` | Admin audit trail |

**Case status values:** `pending`, `hearing`, `reserved`, `disposed`, `appealed`  
**Case types:** `civil`, `criminal`, `family`, `corporate`, `constitutional`, `tax`, `other`

---

## Authentication Flow

1. User registers or logs in via `EnhancedAuthPage`.
2. Backend returns JWT + user object (`POST /api/v1/auth/login` or register).
3. Frontend stores `token`, `user`, `voicelaw_user` in **localStorage**.
4. `api.js` request interceptor adds `Authorization: Bearer <token>`.
5. `ProtectedRoute` blocks unauthenticated access; admins use `/dashboard`, users `/user-panel`.
6. On HTTP **401**, client clears storage and redirects to `/auth/login`.

---

## Environment Variables

### Client (`Client/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Only variables prefixed with `VITE_` are exposed to the browser (Vite rule).

### Server (`server/.env`)

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Token signing secret |
| `JWT_EXPIRE` | Token expiry |
| `CLIENT_URL` | Allowed CORS origins (comma-separated) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| Cloudinary / AI keys | As configured in `config/` |

---

## Running Locally

### Prerequisites

- Node.js 18+
- MongoDB running locally or Atlas URI
- npm

### Backend

```bash
cd server
npm install
npm run dev
```

Server: `http://localhost:5000`  
API base: `http://localhost:5000/api/v1`  
Health: `http://localhost:5000/api/health`

### Frontend

```bash
cd Client
npm install
npm run dev
```

App: `http://localhost:5173` (Vite default)

### Production build

```bash
cd Client
npm run build
```

Output: `Client/dist/`

---

## Design Notes

1. **API versioning:** All REST endpoints are under `/api/v1`.
2. **Central API module:** Frontend should use `Client/src/services/api.js` — avoid hardcoded URLs.
3. **Subscription:** Status is derived from `User.subscription` via profile data, not a separate subscription endpoint.
4. **Case schema:** Backend uses nested fields (`client.name`, `court.name`, `caseType`); forms map UI fields to this schema.
5. **Styling:** New UI uses Tailwind; some modules still use legacy CSS in `styles/` and `User/Style/`.
6. **Real-time:** Socket.io is initialized in `server.js` for future live features.

---

## Document Info

- **Project:** Voice of Law  
- **Stack:** React 19 + Vite 5 + Tailwind 4 | Express 4 + MongoDB  
- **Generated for:** Developer onboarding and project reference  

---

*Voice of Law — Legal case management & AI assistant*
