<div align="center">

```
 █████╗ ██╗     ██╗   ██╗███╗   ███╗███╗   ██╗██╗
██╔══██╗██║     ██║   ██║████╗ ████║████╗  ██║██║
███████║██║     ██║   ██║██╔████╔██║██╔██╗ ██║██║
██╔══██║██║     ██║   ██║██║╚██╔╝██║██║╚██╗██║██║
██║  ██║███████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚████║██║
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝

 ██████╗ ██████╗ ███╗   ██╗███╗   ██╗███████╗ ██████╗████████╗
██╔════╝██╔═══██╗████╗  ██║████╗  ██║██╔════╝██╔════╝╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗  ██║        ██║
██║     ██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝  ██║        ██║
╚██████╗╚██████╔╝██║ ╚████║██║ ╚████║███████╗╚██████╗   ██║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝ ╚═════╝   ╚═╝
```

### 🎓 Connecting Students & Alumni — Opportunities, Referrals, Events & Mentorship in One Platform

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-TODO-lightgrey?style=for-the-badge)](#-license)

<br/>

> **Alumni Connect** bridges the gap between students and alumni — turning a scattered network of contacts into a structured platform for opportunities, referrals, events, and mentorship.

<br/>

[🚀 Get Started](#-getting-started) · [🏗️ Architecture](#️-architecture) · [✨ Features](#-features) · [🗄️ Database](#️-database) · [🔒 Security](#-security)

</div>

---

## 🌟 Why Alumni Connect?

Institutions often rely on informal, disconnected channels for students to reach alumni — scattered LinkedIn messages, WhatsApp groups, or word of mouth. **Alumni Connect** replaces that with a single, structured platform:

| Without Alumni Connect | With Alumni Connect |
|---|---|
| 📱 Students cold-message alumni on LinkedIn | 📋 Students submit structured referral requests in-app |
| 📄 Resumes shared informally, never reviewed | 🤖 Resumes analyzed via AI before reaching alumni |
| 🗂️ Job leads lost in group chats | 💼 Centralized, filterable opportunities board |
| 🎟️ Events organized ad hoc, no RSVP tracking | 📅 Structured event hosting with capacity & registration |
| 🙈 No way to recognize helpful alumni | 🏆 Points-based leaderboard rewards top contributors |
| ✅ No vetting of who's really an alum | 🛡️ Admin-verified alumni registrations |

---

## ✨ Features

<details>
<summary><b>🔐 Authentication</b></summary>
<br/>

User authentication and session management are handled via **Supabase Auth**, wired into the frontend through a dedicated **Auth Context**. Dedicated flows exist for **Login, Register,** and **Forgot Password**.
</details>

<details>
<summary><b>🎓 Student Features</b></summary>
<br/>

- Browse job openings, internships, and freelance opportunities posted by alumni.
- Filter opportunities by **type or industry**.
- Apply directly to listed opportunities.
- Request referrals from verified alumni working at specific companies.
- Attach a resume to referral requests for **AI-assisted analysis**.
- Browse and register for upcoming webinars, meetups, and campus events.
- See other attendees registered for the same event.
</details>

<details>
<summary><b>🎓 Alumni Features</b></summary>
<br/>

- Post job openings, internships, or freelance projects through a personal dashboard.
- Manage previously posted opportunities.
- Receive referral requests from students and choose to **generate or decline** a referral.
- Host events — setting dates, capacities, and descriptions.
- Earn recognition through a **point/ranking system** based on referrals given, events hosted, and questions answered.
</details>

<details>
<summary><b>🛠️ Admin Features</b></summary>
<br/>

- Access a comprehensive **`/admin` portal**.
- Verify new alumni registrations to ensure platform authenticity.
- Moderate submitted opportunities before they go live (review pipeline).
- Moderate events and manage overall community health.
- Broadcast notifications to users.
</details>

<details>
<summary><b>🤝 Referrals</b></summary>
<br/>

Students request referrals from verified alumni at specific companies. Resumes can be analyzed via **Supabase Edge Functions** (AI-powered resume analysis) before alumni review the request. Alumni then choose to generate or decline the referral — creating a direct pipeline between students and opportunities at their target companies.
</details>

<details>
<summary><b>🔔 Notifications</b></summary>
<br/>

Dedicated **notification center components** surface updates to users. Admins can broadcast platform-wide notifications.
</details>

<details>
<summary><b>🔍 Search & Discovery</b></summary>
<br/>

A dedicated **Discover** page lets students and alumni explore opportunities, alumni profiles, and events, with filtering support by type/industry.
</details>

<details>
<summary><b>🏆 Gamification</b></summary>
<br/>

A **Leaderboard / Hall of Fame** highlights top alumni contributors, ranked by referrals given, events hosted, and questions answered. Ranks update dynamically to encourage ongoing engagement.
</details>

<details>
<summary><b>🔒 Security</b></summary>
<br/>

- Authentication and session handling delegated to **Supabase Auth**.
- Admin-side verification step for new alumni sign-ups to prevent impersonation.
- Admin moderation pipeline for opportunities and events before public visibility.

> TODO: Document Row-Level Security (RLS) policies, input validation, and other backend security practices if applicable.
</details>

<details>
<summary><b>➕ Other Features</b></summary>
<br/>

- Avatar and file uploads handled via **Supabase Storage**.
- Smooth UI interactions powered by **Framer Motion** and **Lucide** icons.
</details>

---

## 🏗️ Architecture

### System Overview

```
╔══════════════════════════════════════════════════════════════════════════╗
║                       ALUMNI CONNECT — SYSTEM FLOW                       ║
╚══════════════════════════════════════════════════════════════════════════╝

 ┌───────────────────────────────────────────────────────────────────────┐
 │                     👤  STUDENT / ALUMNI / ADMIN                      │
 └───────────────────┬─────────────────────────────┬─────────────────────┘
                     │                             │
              [Posts / Applies /            [Views Dashboard /
               Requests Referral]            Discover / Events /
                     │                        Leaderboard]
                     ▼                             ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │                 🖥️  REACT (VITE) FRONTEND                             │
 │                                                                       │
 │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
 │  │ React Router │  │ Auth Context │  │  Framer       │                │
 │  │    DOM       │  │              │  │  Motion + UI  │                │
 │  └──────────────┘  └──────────────┘  └──────────────┘                │
 │                                                                       │
 │  Pages: Dashboard · Discover · Events · Referrals · Admin             │
 └───────────────────┬─────────────────────────────┬─────────────────────┘
                     │                             │
             [Auth] │            [CRUD via         │  [Avatar / File
                     │            Supabase JS]      │   Uploads]
                     ▼                             ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │                       ⚡  SUPABASE PLATFORM                           │
 │                                                                       │
 │  ┌─────────────┐   ┌───────────────────────┐   ┌───────────────────┐ │
 │  │  Supabase   │   │  PostgreSQL Database   │   │ Supabase Storage  │ │
 │  │    Auth     │   │  (opportunities,       │   │ (avatars, resumes,│ │
 │  │             │   │   referrals, events,   │   │  event/media      │ │
 │  │             │   │   users, notifications)│   │  assets)          │ │
 │  └─────────────┘   └───────────┬───────────┘   └───────────────────┘ │
 └────────────────────────────────┼───────────────────────────────────────┘
                                  │
                       [Referral Submitted +
                        Resume Attached]
                                  │
                                  ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │              🦕  SUPABASE EDGE FUNCTIONS (Deno Runtime)               │
 │                                                                       │
 │                     AI Resume Analysis Function                      │
 │                                                                       │
 │   1. Receive referral request + attached resume                      │
 │   2. Run AI-assisted analysis on resume content                      │
 │   3. Return structured insights to the referral pipeline             │
 └───────────────────────────────────────────────────────────────────────┘
```

### Referral Lifecycle

```
                    ┌──────────────────────┐
                    │  📝  REQUEST CREATED  │  ← Student selects alumnus + company
                    └──────────┬───────────┘
                               │  Resume attached (optional)
                               ▼
                    ┌──────────────────────┐
                    │  🤖  AI ANALYSIS      │  ← Edge Function analyzes resume
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  📬  ALUMNI REVIEW    │  ← Alumnus reviews the request
                    └──────────┬───────────┘
                     ┌─────────┴─────────┐
                     ▼                   ▼
          ┌────────────────────┐  ┌────────────────────┐
          │  ✅  GENERATED      │  │  ❌  DECLINED       │
          │  (Referral issued) │  │  (Request closed)  │
          └──────────┬─────────┘  └────────────────────┘
                     │
                     ▼
          Points awarded to alumnus 🏆
```

### Opportunity Moderation Flow

```
   ┌────────────────┐      ┌────────────────┐      ┌────────────────┐
   │  📝  SUBMITTED  │ ───► │  ⏳  IN REVIEW  │ ───► │  ✅  APPROVED   │
   │ (by Alumni)    │      │ (Admin queue)  │      │ (Visible to    │
   └────────────────┘      └───────┬────────┘      │  all Students) │
                                   │                └────────────────┘
                                   ▼
                          ┌────────────────┐
                          │  ❌  REJECTED   │
                          └────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React (Vite) |
| Routing | React Router DOM |
| State/Context | React Context (Auth Context) |
| Animations | Framer Motion |
| Icons | Lucide |
| Styling | Tailwind CSS |

### Backend & AI
| Layer | Technology |
|---|---|
| BaaS | Supabase (Auth, Database, Storage, Edge Functions) |
| Database | PostgreSQL (via Supabase) |
| Serverless | Supabase Edge Functions (Deno runtime) |
| AI | AI-powered resume analysis via Edge Functions |
| File Storage | Supabase Storage (avatars, file uploads) |
| Deployment | > TODO: Add deployment platform (e.g., Vercel, Netlify) |

---

## 📂 Folder Structure

```
Alumni_Connect/
├── public/                     # Static assets
├── supabase/                   # Backend configuration and edge functions
│   └── functions/              # Deno edge functions (e.g., AI resume analysis)
├── src/
│   ├── assets/                 # Project-specific assets (images, fonts)
│   ├── components/             # Reusable UI components
│   │   ├── auth/                # Authentication related components
│   │   ├── events/               # Event management components
│   │   ├── layout/                # Structural components (Sidebar, Navbar)
│   │   ├── notifications/          # Notification center components
│   │   ├── opportunities/           # Job/Internship board components
│   │   ├── referrals/                # Referral request/generation components
│   │   └── ui/                        # Generic UI elements (Buttons, Cards, Modals)
│   ├── contexts/                # React Contexts (AuthContext)
│   ├── hooks/                   # Custom React hooks (useReferrals, etc.)
│   ├── lib/                     # Third-party library integration
│   │   └── supabase.js           # Supabase client initialization
│   ├── pages/                   # Top-level route components
│   │   ├── admin/                 # Admin dashboard and moderation views
│   │   ├── auth/                    # Login, Register, Forgot Password
│   │   └── ...                        # Dashboard, Discover, Events, etc.
│   ├── utils/                    # Helper utilities (date formatting, cn)
│   ├── App.jsx                    # Main application and routing setup
│   ├── index.css                   # Global styles and Tailwind configuration
│   └── main.jsx                     # Application entry point
├── .env.example                   # Sample environment variable template
├── package.json                    # Project dependencies and scripts
└── vite.config.js                   # Vite build configuration
```

---

## 🚀 Getting Started

### ✅ Prerequisites
- **Node.js** installed on your system
- A **Supabase** project (for Auth, Database, Storage, and Edge Functions)

### 📥 Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/alumni-connect.git
cd alumni-connect

# Install dependencies
npm install
```

### 🔑 Environment Variables (.env)

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ **Never commit your `.env` file.** Ensure it is listed in `.gitignore` before pushing to GitHub.

### ▶️ Running Locally

```bash
npm run dev
```

> TODO: Confirm local dev server URL/port (e.g., `http://localhost:5173`).

### 📦 Build

```bash
npm run build
```

> TODO: Add build output details or deployment steps if applicable.

---

## 🗄️ Database

```
┌──────────────┐       ┌────────────────────┐       ┌────────────────────┐
│    users     │       │   opportunities     │       │      referrals      │
├──────────────┤       ├────────────────────┤       ├────────────────────┤
│ id (PK)      │──┐    │ id (PK)             │──┐    │ id (PK)             │
│ role         │  │    │ posted_by (FK)      │  │    │ requested_by (FK)   │
│ points       │  └───►│ title / description │  └───►│ alumni_id (FK)      │
│ verified     │       │ type / industry     │       │ resume_url          │
└──────────────┘       │ status              │       │ status              │
                       └────────────────────┘       └────────────────────┘

┌──────────────┐       ┌────────────────────┐
│    events    │       │   notifications     │
├──────────────┤       ├────────────────────┤
│ id (PK)      │       │ id (PK)             │
│ hosted_by FK │       │ broadcast_by (FK)   │
│ date/capacity│       │ message             │
│ attendees[]  │       │ created_at          │
└──────────────┘       └────────────────────┘
```

> TODO: Confirm exact table names, columns, and relationships against the live Supabase schema.

---

## 🔒 Security

- **Authentication:** Handled entirely through **Supabase Auth**.
- **Authorization / Verification:** Admins manually verify new alumni registrations to maintain community authenticity.
- **Moderation:** Opportunities and events pass through an admin review pipeline before becoming publicly visible.

> TODO: Add specifics on Row-Level Security (RLS) policies, API validation, and rate limiting if implemented.

---

## 🎯 Future Improvements

> TODO: Add planned features or enhancements for upcoming releases.

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repository, then:
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

Then open a **Pull Request** 🎉

---

## 📄 License

> TODO: Add project license (e.g., MIT, Apache 2.0).

---

## 👨‍💻 Author

> TODO: Add author name, GitHub profile link, and contact/portfolio details.

---

<div align="center">

Built with ❤️ to connect students and alumni.

**[⬆ Back to top](#)**

</div>
