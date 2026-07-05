# 🎓 Alumni Connect

**Bridging students and alumni — one connection, opportunity, and referral at a time.**

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-TODO-lightgrey)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## 📖 Overview

**Alumni Connect** is a comprehensive platform designed to foster meaningful connections between students and alumni within an institution's community. It provides tools for **networking, sharing opportunities, managing events, and facilitating referrals**, helping students tap into the experience and industry access of their alumni network.

The platform exists to solve a common gap in academic institutions — students often lack a structured, trustworthy way to reach alumni for **job opportunities, referrals, mentorship, and events**. Alumni Connect brings these interactions into one verified, moderated ecosystem.

---

## ✨ Features

<details>
<summary><strong>🔐 Authentication</strong></summary>

- User authentication managed via **Supabase Auth**, integrated through a dedicated **Auth Context** in the frontend.
- Dedicated auth pages/components: **Login, Register, Forgot Password**.

</details>

<details>
<summary><strong>🎓 Student Features</strong></summary>

- Browse job openings, internships, and freelance opportunities posted by alumni.
- Filter opportunities by **type or industry**.
- Apply directly to listed opportunities.
- Request referrals from verified alumni working at specific companies.
- Attach a resume to referral requests for **AI-assisted analysis**.
- Browse and register for upcoming webinars, meetups, and campus events.
- View other attendees registered for the same event.

</details>

<details>
<summary><strong>🎓 Alumni Features</strong></summary>

- Post job openings, internships, or freelance projects through a personal dashboard.
- Manage posted opportunities.
- Receive referral requests from students and choose to **generate or decline** a referral.
- Host events — setting dates, capacities, and descriptions.
- Earn recognition through a **point/ranking system** based on contributions (referrals given, events hosted, questions answered).

</details>

<details>
<summary><strong>🛠️ Admin Features</strong></summary>

- Access a comprehensive **`/admin` portal**.
- Verify new alumni registrations to ensure platform authenticity.
- Moderate submitted opportunities before they go live (review pipeline).
- Moderate events and manage overall community health.
- Broadcast notifications to users.

</details>

<details>
<summary><strong>🤝 Referrals</strong></summary>

- Students request referrals from verified alumni at specific companies.
- Resumes can be analyzed via **Edge Functions** (AI-powered resume analysis).
- Alumni review requests and decide to generate or decline the referral.
- Creates a direct pipeline connecting students with opportunities at target companies.

</details>

<details>
<summary><strong>🔔 Notifications</strong></summary>

- Dedicated **notification center components** in the frontend.
- Admins can broadcast notifications platform-wide.

</details>

<details>
<summary><strong>🔍 Search & Discovery</strong></summary>

- A dedicated **Discover** page for exploring opportunities, alumni, and events.
- Filtering support for opportunities by **type/industry**.

</details>

<details>
<summary><strong>🏆 Gamification</strong></summary>

- **Leaderboard / Hall of Fame** highlighting top alumni contributors.
- Rankings are based on referrals given, events hosted, and questions answered.
- Ranks update dynamically to encourage ongoing engagement.

</details>

<details>
<summary><strong>🔒 Security</strong></summary>

- Authentication and session handling delegated to **Supabase Auth**.
- Admin-side verification step for new alumni sign-ups to prevent impersonation.
- Admin moderation pipeline for opportunities and events before public visibility.

> TODO: Add details on Row-Level Security (RLS) policies, input validation, and other backend security practices if applicable.

</details>

<details>
<summary><strong>➕ Other Features</strong></summary>

- Avatar and file uploads handled via **Supabase Storage**.
- Smooth UI interactions powered by **Framer Motion** and **Lucide** icons.

</details>

---

## 🏗️ Architecture

Alumni Connect follows a **modern serverless architecture**, using **React (Vite)** on the frontend and **Supabase** for backend infrastructure — authentication, database, storage, and serverless compute via Edge Functions.

```mermaid
graph TD
    Client["Client (Browser)"]
    
    subgraph Frontend [Frontend (React + Vite)]
        Router["React Router DOM"]
        AuthCtx["Auth Context"]
        Pages["Pages (Dashboard, Discover, Events)"]
        Components["UI Components (Framer Motion, Lucide)"]
        
        Router --> Pages
        Pages --> Components
        AuthCtx --> Pages
    end
    
    subgraph Backend [Supabase]
        Auth["Supabase Auth"]
        DB["PostgreSQL Database"]
        Storage["Supabase Storage"]
        Edge["Edge Functions"]
    end
    
    Client --> Frontend
    Frontend -- "Authentication" --> Auth
    Frontend -- "CRUD Operations via Supabase JS" --> DB
    Frontend -- "Avatar/File Uploads" --> Storage
    Frontend -- "AI Resume Analysis" --> Edge
```

---

## 🛠️ Tech Stack

| Layer              | Technology                                             |
|---------------------|--------------------------------------------------------|
| **Frontend**        | React (Vite), React Router DOM, Framer Motion, Lucide  |
| **Backend**         | Supabase (Edge Functions — Deno runtime)               |
| **Database**        | PostgreSQL (via Supabase)                              |
| **Authentication**  | Supabase Auth                                          |
| **Storage**         | Supabase Storage (avatars, file uploads)               |
| **Deployment**      | > TODO: Add deployment platform (e.g., Vercel, Netlify) |
| **AI Tools**        | AI-powered resume analysis via Supabase Edge Functions |

---

## 📂 Folder Structure

```
Alumni_Connect/
├── public/                 # Static assets
├── supabase/                # Backend configuration and edge functions
│   └── functions/           # Deno edge functions (e.g., AI resume analysis)
├── src/
│   ├── assets/               # Project-specific assets (images, fonts)
│   ├── components/           # Reusable UI components
│   │   ├── auth/              # Authentication related components
│   │   ├── events/            # Event management components
│   │   ├── layout/             # Structural components (Sidebar, Navbar)
│   │   ├── notifications/      # Notification center components
│   │   ├── opportunities/      # Job/Internship board components
│   │   ├── referrals/          # Referral request/generation components
│   │   └── ui/                  # Generic UI elements (Buttons, Cards, Modals)
│   ├── contexts/              # React Contexts (AuthContext)
│   ├── hooks/                  # Custom React hooks (useReferrals, etc.)
│   ├── lib/                    # Third-party library integration
│   │   └── supabase.js          # Supabase client initialization
│   ├── pages/                  # Top-level route components
│   │   ├── admin/                # Admin dashboard and moderation views
│   │   ├── auth/                  # Login, Register, Forgot Password
│   │   └── ...                     # Dashboard, Discover, Events, etc.
│   ├── utils/                   # Helper utilities (date formatting, cn)
│   ├── App.jsx                  # Main application and routing setup
│   ├── index.css                 # Global styles and Tailwind configuration
│   └── main.jsx                   # Application entry point
├── .env.example                 # Sample environment variable template
├── package.json                  # Project dependencies and scripts
└── vite.config.js                 # Vite build configuration
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

Create a `.env` file in the project root with the following variables:

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

Alumni Connect uses a **PostgreSQL database** provisioned and managed through **Supabase**.

> TODO: Add details of key database tables (e.g., users, opportunities, referrals, events, notifications) and their relationships.

---

## 🔐 Security

- **Authentication:** Handled entirely through **Supabase Auth**.
- **Authorization / Verification:** Admins manually verify new alumni registrations to maintain community authenticity.
- **Moderation:** Opportunities and events pass through an admin review pipeline before becoming publicly visible.

> TODO: Add specifics on Row-Level Security (RLS) policies, API validation, and rate limiting if implemented.

---

## 🎯 Future Improvements

> TODO: Add planned features or enhancements for upcoming releases.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "Add your feature"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/your-feature
   ```
5. **Open** a Pull Request

---

## 📄 License

> TODO: Add project license (e.g., MIT, Apache 2.0).

---

## 👨‍💻 Author

> TODO: Add author name, GitHub profile link, and contact/portfolio details.

---

<p align="center">Made with ❤️ to connect students and alumni.</p>