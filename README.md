<div align="center">

<br />

# 🪐 Planetrix

### *AI-Powered Solar System Explorer*

> **Frontend Developer Hiring Task — Ontenet Digital Ltd.**

<br />

[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)

<br />

| 🌐 Live Demo | 📂 GitHub Repo |
|:---:|:---:|
| **[planetrix.vercel.app](https://planetrix-gamma.vercel.app/)** | **[github.com/zahid397/planetrix](https://github.com/zahid397/planetrix)** |

<br />

</div>

---

## 📸 Preview

<div align="center">

> *A premium dark-themed interactive solar system explorer with AI chat, 3D planet rendering, job application system, and full authentication — all running without a backend.*

</div>

---

## 🧑‍💻 Candidate Info

| Field | Details |
|-------|---------|
| **Name** | Zahid Hasan |
| **Position** | Frontend Developer |
| **Company** | Ontenet Digital Ltd. |
| **Deadline** | 25 April 2026, 11:59 PM |
| **Submitted** | On time ✅ |

---

## ✨ Features

### 🔐 Authentication System
- Email + Password **Sign Up** and **Sign In**
- Persistent session via `localStorage`
- **Protected Routes** — pages redirect unauthenticated users
- **Admin role** with separate admin dashboard access
- Password reset flow (local simulation)
- One-click **Demo Account** login

### 🪐 Solar System Explorer
- Interactive 3D planet rendering using **Three.js + React Three Fiber**
- Navigate between all 9 planets + the Sun
- Animated orbital arcs and neighbor planets
- Planet stats panel with diameter, temperature, day length, and more
- Saturn's rings rendered in 3D

### 🤖 AI Planet Chat
- Ask questions about any planet in **natural language**
- Streamed character-by-character AI responses
- Bilingual support: English + Bangla topic suggestions
- **Compare two planets** with AI-generated side-by-side analysis
- Chat history persisted in `localStorage` per planet per session

### 👔 Careers & Job Applications
- Full job application form with validation (Zod)
- Fields: name, email, phone, experience, portfolio URL, cover note, resume upload
- Draft auto-saved to `localStorage` so you never lose your work
- Applications stored locally and viewable in Admin Dashboard
- WhatsApp delivery integration

### 🛡️ Admin Dashboard
- Protected admin-only route (`/admin`)
- View all submitted job applications in a sortable, paginated table
- Filter by role, experience, status (new / reviewed)
- Mark applications as reviewed
- Delete applications with confirmation dialog
- Export filtered results to **CSV**
- Stats: total, this week, pending, with resume

### 🎨 UI & Animations
- Deep space dark theme with glassmorphism cards
- Animated starfield canvas background
- Galaxy canvas with floating particles
- Smooth page transitions with **Framer Motion**
- Sound toggle with ambient planet tones
- Profile side panel with favorites, history, settings
- Fully **mobile-responsive** with bottom navigation on mobile

---

## 🛠️ Tech Stack

```
React 18 + TypeScript    — Core framework, fully typed
Vite                     — Lightning-fast dev server & build tool
Tailwind CSS             — Utility-first styling
React Router v6          — Client-side routing + protected routes
React Three Fiber        — 3D planet rendering in the browser
Three.js (r160)          — 3D engine
Zod                      — Form schema validation
React Hook Form          — Form state management
Tanstack Query           — Data fetching & caching
Lucide React             — Consistent icon library
Sonner                   — Toast notifications
Radix UI                 — Accessible headless UI primitives
shadcn/ui                — Pre-built component system
localStorage Auth        — Zero-dependency session management
```

---

## 📁 Project Structure

```
planetrix/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/                   # Planet images
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── footer-content/       # Footer modal content
│   │   ├── skeleton/             # Loading skeletons
│   │   ├── ActionDock.tsx        # Bottom action bar
│   │   ├── ApplyForm.tsx         # Job application form
│   │   ├── CenterPlanet.tsx      # Main planet display
│   │   ├── CenterPlanet3D.tsx    # 3D planet (Three.js)
│   │   ├── ComparePlanets.tsx    # AI planet comparison
│   │   ├── GalaxyCanvas.tsx      # Background galaxy effect
│   │   ├── Header.tsx            # Top navigation
│   │   ├── PlanetChat.tsx        # Floating AI chat widget
│   │   ├── PlanetInfoPanel.tsx   # Planet detail panel
│   │   ├── PlanetStats.tsx       # Stats display cards
│   │   ├── ProfilePanel.tsx      # Slide-out user panel
│   │   ├── ProtectedRoute.tsx    # Auth guard component
│   │   ├── StarfieldCanvas.tsx   # Animated stars
│   │   └── UserMenu.tsx          # Account dropdown
│   ├── context/
│   │   └── AuthContext.tsx       # 🔑 Local auth system (NEW)
│   ├── data/
│   │   ├── planets.ts            # All planet data
│   │   └── mockContent.ts        # Mock news, tools, voice lines
│   ├── hooks/
│   │   ├── useAdminAuth.ts       # Auth hook (uses context)
│   │   ├── useAmbientSound.ts    # Sound effects
│   │   ├── useImageLoader.ts     # Progressive image loading
│   │   └── usePlanetNav.ts       # Planet navigation state
│   ├── lib/
│   │   ├── localDB.ts            # 🗄️ localStorage database (NEW)
│   │   ├── mockAI.ts             # 🤖 Local AI engine (NEW)
│   │   ├── csv.ts                # CSV export utility
│   │   ├── session.ts            # Session ID helper
│   │   ├── whatsapp.ts           # WhatsApp link builder
│   │   └── utils.ts              # Shared utilities
│   ├── pages/
│   │   ├── Index.tsx             # Home / planet explorer
│   │   ├── Dashboard.tsx         # User dashboard
│   │   ├── ChatPage.tsx          # Full-screen AI chat
│   │   ├── Auth.tsx              # Sign in / Sign up
│   │   ├── AdminDashboard.tsx    # Admin panel
│   │   ├── AdminLogin.tsx        # Admin redirect
│   │   ├── ResetPassword.tsx     # Password reset
│   │   └── NotFound.tsx          # 404 page
│   ├── App.tsx                   # Routes + providers
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/zahid397/planetrix.git
cd planetrix
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

Open **[http://localhost:8080](http://localhost:8080)** ✅

> No environment variables required — the app works fully out of the box.

---

## 🔑 Demo Credentials

The following accounts are auto-seeded on first load:

| Role | Email | Password |
|------|-------|----------|
| 🧑‍🚀 **Demo User** | `demo@planetrix.app` | `Demo!Explorer#2099` |
| 🛡️ **Admin** | `admin@planetrix.app` | `Admin@2099!` |

You can also **create your own account** from the Sign Up page — no email confirmation required.

---

## 🔐 Authentication Architecture

This app uses a fully local, zero-dependency auth system:

```
┌─────────────────────────────────────────────────┐
│              AuthContext (React Context)          │
│                                                   │
│  signIn()  → verify email+hash from localStorage │
│  signUp()  → store new user in localStorage       │
│  signOut() → clear session from localStorage      │
│                                                   │
│  Users stored in: localStorage["px_users"]        │
│  Session stored in: localStorage["px_session"]    │
└─────────────────────────────────────────────────┘
         ↓
  ProtectedRoute.tsx  →  redirects if not logged in
  useAdminAuth.ts     →  role-based access (isAdmin)
```

---

## 🚀 Build for Production

```bash
npm run build
npm run preview
```

### Deploy on Vercel

```bash
npx vercel --prod
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new) — zero config needed.

---

## 📜 Available Scripts

```bash
npm run dev        # Start development server (port 8080)
npm run build      # TypeScript compile + Vite build
npm run preview    # Preview production build locally
npm run lint       # ESLint check
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| BG Deep | `#03060f` | Page background |
| BG Dark | `#060B18` | Section background |
| BG Card | `#0A1628` | Card backgrounds |
| Border | `rgba(255,255,255,0.08)` | Subtle borders |
| Purple | `hsl(280 85% 60%)` | AI / chat accent |
| Blue | `hsl(220 90% 55%)` | Primary actions |
| Cyan | `hsl(190 85% 60%)` | Compare accent |
| Teal | `hsl(180 70% 35%)` | Secondary actions |
| Green | `#10B981` | Success / safe |
| Red | `#EF4444` | Danger / delete |
| Font | System (`Barlow`, sans-serif) | Body text |

---

## 🛣️ Page Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Solar system explorer | Public |
| `/dashboard` | User mission hub | Public |
| `/chat` | Full-screen AI chat | Public |
| `/auth` | Sign in / Sign up | Public |
| `/reset-password` | Password reset | Public |
| `/admin/login` | → Redirects to `/auth?next=/admin` | Public |
| `/admin` | Admin applications dashboard | **Admin only** |

---

## 💡 Key Technical Decisions

**No backend required** — Everything runs in the browser:
- Auth → `localStorage` with hashed passwords
- Chat history → `localStorage` per session + planet
- Job applications → `localStorage` (visible in admin panel)
- AI responses → local deterministic engine (no API calls)

**Why this approach:**
- Zero infrastructure cost
- Works 100% offline after first load
- Instantly deployable anywhere (Vercel, Netlify, GitHub Pages)
- Demonstrates deep React + state management skills

---

## 👨‍💻 Author

<div align="center">

**Zahid Hasan**
Frontend Developer

[![GitHub](https://img.shields.io/badge/GitHub-zahid397-181717?style=flat&logo=github)](https://github.com/zahid397)

</div>

---

## 📄 License

MIT License — open source and free to use.

---

<div align="center">

**🪐 Planetrix — Frontend Developer Hiring Task**

*Submitted to Ontenet Digital Ltd. · April 2026*

*Built with ❤️ by Zahid Hasan*

</div>
