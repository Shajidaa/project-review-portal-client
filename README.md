# 🚀 Project Review Portal — Client Application

A modern, responsive, role-based web application and dashboard built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Radix UI / shadcn/ui**.

This frontend provides specialized experiences for three distinct roles:
- **Students**: Submit project repositories, track evaluation milestones, view mentor feedback, and visualize submission analytics.
- **Mentors**: Inspect student submissions, analyze approval trends, and submit reviews with detailed feedback.
- **Admins**: Manage users and permissions, inspect platform metrics, oversee all submissions, and analyze system-wide audit logs.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Student Portal](#1-student-portal)
  - [Mentor Portal](#2-mentor-portal)
  - [Admin Portal](#3-admin-portal)
  - [Authentication & Security](#4-authentication--security)
  - [Design & User Experience](#5-design--user-experience)
- [Tech Stack](#-tech-stack)
- [System Architecture & Folder Structure](#-system-architecture--folder-structure)
- [Route Map & Navigation](#-route-map--navigation)
- [Prerequisites](#-prerequisites)
- [Getting Started & Installation](#-getting-started--installation)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Component & State Architecture](#-component--state-architecture)
- [Connecting with Backend](#-connecting-with-backend)
- [Deployment (Vercel)](#-deployment-vercel)
- [Contributing & License](#-contributing--license)

---

## 🌟 Overview

The **Project Review Portal Client** is designed to streamline software engineering project evaluations. With dedicated dashboards tailored to each user role, the platform simplifies code review handoffs, ensures transparent evaluation criteria, and maintains a complete audit trail.

---

## ✨ Key Features

### 1. Student Portal
- **Interactive KPI Dashboard**: Real-time counters for Total Submissions, Pending In-Review, Approved, and Rejected projects.
- **Visual Analytics (Recharts)**:
  - **Submission Status Breakdown**: Dynamic Pie chart showing the proportion of project outcomes.
  - **Tech Stack Workload**: Responsive Bar chart detailing projects across Frontend, Backend, Fullstack, and Mobile stacks.
- **Project Submission Form**:
  - Validates project title, type (`WEB`, `MOBILE`, `OTHER`), repository URL, live deployment link, and tech stack.
  - Duplicate repo protection and anti-spam handling.
- **My Submissions Table**:
  - Filter by submission status (`ALL`, `PENDING`, `APPROVED`, `REJECTED`).
  - Pagination controls for high-volume submission histories.
  - Ability to delete pending submissions prior to mentor review.
- **Submission Detail View**: Deep-dive into project details, repo URLs, live preview, reviewer info, and mentor feedback comments.

### 2. Mentor Portal
- **Performance & Workload Overview**:
  - High-level metric cards: Total Submissions, Pending Queue, Approved Count, Rejected Count, and Overall Approval Rate percentage.
  - **Interactive Analytics**:
    - `ApprovalRateBar`: Track approval percentage visually.
    - `StatusPieChart`: Distribution of review outcomes.
    - `StackWorkloadChart`: Workload categorized by technology stack.
    - `MonthlyVolumeChart`: Temporal trend analysis of student submissions.
- **Review Queue**:
  - Filterable by project type and approval status.
  - Multi-field text search (search by project title, student name, or student email).
- **Interactive Review Modal**:
  - Fast-action **Approve** or **Reject** decision buttons.
  - Rich feedback textarea for mentor notes, recommendations, and code review comments.
  - Real-time status update with automatic list refresh.

### 3. Admin Portal
- **System KPIs & Health Metrics**: Instant visibility into total platform users, submissions count, approval ratios, and recent system actions.
- **User Management**:
  - Paginated table of all registered users with name, email, avatar, role, and verification status.
  - Instant role updates (promote or demote between `STUDENT`, `MENTOR`, and `ADMIN`).
  - Search by user name or email address.
  - User deletion safeguards.
- **All Submissions Manager**: Platform-wide view of all student code submissions across all repositories.
- **Comprehensive Audit Logs Viewer**:
  - Tamper-evident record of all critical platform actions (`SUBMISSION_CREATED`, `SUBMISSION_APPROVED`, `USER_ROLE_UPDATED`, `USER_PASSWORD_CHANGED`, etc.).
  - Search and filter by User ID, Action Type, Target ID, and Date Range (`from` / `to`).
  - Expandable JSON modal displaying full payload diffs and execution context.

### 4. Authentication & Security
- **OTP-Verified Registration**: User registers -> receives 6-digit OTP email -> verifies account -> automatically signs in.
- **Forgot Password Recovery**: Secure OTP-based reset flow.
- **Role-Based Guards (`RoleGuard`)**: Client-side authorization wrapper automatically restricting views based on the active JWT role.
- **Cookie & Token Management**:
  - Supports server-set `httpOnly` secure cookies alongside local token persistence for seamless API synchronization.

### 5. Design & User Experience
- **Theme Toggle**: Effortless dark and light theme switching with `next-themes`.
- **Responsive Navigation**: Full desktop sidebar + responsive mobile slide-out drawer with quick search index.
- **Toast Notifications**: Contextual notifications for all network actions powered by `sonner`.

---

## 🛠 Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | React framework with Server & Client components |
| **Library** | [React 19](https://react.dev/) | Modern UI library with latest concurrent features |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (v5) | Strongly typed JavaScript |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation utility-first CSS engine |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/) | Accessible, unstyled UI primitives styled with Tailwind |
| **Data Viz** | [Recharts](https://recharts.org/) (v2.15) | Composable charting library for dashboard metrics |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, clean icon collection |
| **Themes** | [next-themes](https://github.com/pacocoursey/next-themes) | System-aware dark & light theme provider |
| **Toasts** | [Sonner](https://sonner.emilkowal.ski/) | Opinionated toast notification library |

---

## 📂 System Architecture & Folder Structure

```text
project-review-portal-client/
├── app/
│   ├── (main)/                        # Public & authentication route group
│   │   ├── layout.tsx                 # Public layout with top Navbar & theme provider
│   │   ├── page.tsx                   # Root redirect controller (routes by user role)
│   │   ├── login/page.tsx             # Sign in form
│   │   ├── register/page.tsx          # Account registration & OTP verification flow
│   │   └── forgot-password/page.tsx   # Password reset with OTP
│   ├── (dashboard)/                   # Protected authenticated dashboard route group
│   │   ├── layout.tsx                 # Authenticated layout with AuthProvider & theme
│   │   └── dashboard/
│   │       ├── page.tsx               # Role redirect dispatcher
│   │       ├── student/               # Student views
│   │       │   ├── page.tsx           # Student KPI cards & visual charts
│   │       │   └── submissions/       # Submissions table, detail [id], and new wizard
│   │       ├── mentor/                # Mentor views
│   │       │   ├── page.tsx           # Mentor review workload & KPI graphs
│   │       │   ├── _charts/           # Recharts visualization modules
│   │       │   └── submissions/       # Review queue & submission inspection
│   │       ├── admin/                 # Admin views
│   │       │   ├── page.tsx           # Platform health & statistics overview
│   │       │   ├── users/             # User management & role modification
│   │       │   ├── submissions/       # Global submissions viewer
│   │       │   └── audit-logs/        # Audit log filter & JSON inspect table
│   │       └── profile/page.tsx       # User profile details & password change
│   ├── globals.css                    # Tailwind CSS v4 directives & theme variables
│   └── layout.tsx                     # Root HTML document wrapper
├── components/
│   ├── auth/                          # LoginForm, RegisterForm, OtpVerification, RoleGuard
│   ├── dashboard/                     # Shell, Navbar, Sidebar, ReviewModal, SubmissionsTable
│   ├── navbar/                        # Top navbar, MobileMenu, ThemeToggle, UserMenu
│   ├── shared/                        # Container & common layout wrappers
│   └── ui/                            # shadcn/ui components (button, card, dialog, badge, etc.)
├── contexts/
│   └── auth-context.tsx               # React AuthContext holding current user & refresh state
├── lib/
│   ├── api.ts                         # Base fetch wrapper with auth header injection
│   ├── submission-api.ts              # API calls for submissions (CRUD, reviews, stats)
│   ├── user-api.ts                    # API calls for user profiles & admin management
│   ├── audit-log-api.ts               # API calls for fetching and filtering audit logs
│   ├── navigation.ts                  # Role-based sidebar links and search index
│   └── utils.ts                       # ClassName merging utilities (clsx & twMerge)
├── types/                             # TypeScript definitions (auth, user, submission, auditLog)
├── .env.local                         # Environment variable configuration
├── package.json                       # Dependencies and run scripts
└── tsconfig.json                      # TypeScript configuration
```

---

## 🗺 Route Map & Navigation

| URL Path | Role Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Automatic role-based redirect to assigned dashboard or `/login` |
| `/login` | Public | User authentication page |
| `/register` | Public | User registration with email verification OTP step |
| `/forgot-password` | Public | Account recovery and password reset via OTP |
| `/dashboard/student` | `STUDENT` | Student dashboard home (KPI counters, submission charts) |
| `/dashboard/student/submissions` | `STUDENT` | Student's own submissions table with status filter |
| `/dashboard/student/submissions/new` | `STUDENT` | Submit a new project for review |
| `/dashboard/student/submissions/:id` | `STUDENT` | Detailed view of student's own project and mentor feedback |
| `/dashboard/mentor` | `MENTOR` | Mentor dashboard home (workload stats, review charts) |
| `/dashboard/mentor/submissions` | `MENTOR` | Review queue of all student submissions |
| `/dashboard/mentor/submissions/:id` | `MENTOR` | Submission detail view with review action modal |
| `/dashboard/admin` | `ADMIN` | System overview, platform health metrics |
| `/dashboard/admin/users` | `ADMIN` | User accounts table, search, role management |
| `/dashboard/admin/submissions` | `ADMIN` | Global submissions manager |
| `/dashboard/admin/audit-logs` | `ADMIN` | Platform audit log inspector with filters |
| `/dashboard/profile` | Authenticated | Manage personal profile and password |

---

## ⚙️ Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm**, **pnpm**, or **yarn**
- Running **Project Review Portal Server** (running on `http://localhost:5000` by default)

---

## 🚀 Getting Started & Installation

### 1. Navigate to the client directory

```bash
cd project-review-portal/project-review-portal-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create or edit `.env.local` in the client directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch the application.

---

## 🔐 Environment Variables

The client requires only one primary public environment variable:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api/v1` | The base URL of the backend REST API server |

Place this variable inside your `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles and optimizes the application for production |
| `npm start` | Runs the built production Next.js server |
| `npm run lint` | Runs ESLint to check for code quality and syntax errors |
| `npm run format` | Automatically formats TypeScript and TSX files with Prettier |
| `npm run typecheck`| Runs TypeScript type-checking without emitting files (`tsc --noEmit`) |

---

## 🧩 Component & State Architecture

### 1. Authentication State (`AuthProvider`)
The application utilizes a React Context provider at `contexts/auth-context.tsx`:
- Synchronizes with the backend via `/api/v1/users/me`.
- Persists user info and tokens in local storage while leveraging `credentials: "include"` for HTTP-only cookies.
- Exposes `user`, `isLoading`, `refreshUser()`, and `logout()`.

### 2. Route Protection (`RoleGuard`)
Located at `components/auth/RoleGuard.tsx`:
- Intercepts unauthorized navigation attempts.
- If unauthenticated, smoothly redirects to `/login`.
- If authenticated under an incompatible role, redirects to the user's appropriate portal dashboard.

### 3. API Communication Layer
All HTTP calls are encapsulated within strongly typed service modules in `lib/`:
- **`api.ts`**: Core `apiRequest<T>()` fetch wrapper handling base URLs, bearer token headers, cookie inclusion, and error formatting.
- **`submission-api.ts`**: Methods for `create`, `getMySubmissions`, `getAll`, `getById`, `review`, `delete`, and `getStats`.
- **`user-api.ts`**: Methods for `updateProfile`, `changePassword`, `getAllUsers`, `updateRole`, and `deleteUser`.
- **`audit-log-api.ts`**: Methods for `getAuditLogs` and `getAuditLogsByUser`.

---

## 🔗 Connecting with Backend

To run the complete system locally:

1. **Start PostgreSQL and Redis** on your local machine or cloud provider.
2. **Start the backend server**:
   ```bash
   cd project-review-portal/project-review-portal-server
   npm run dev
   # Runs on http://localhost:5000
   ```
3. **Start the client**:
   ```bash
   cd project-review-portal/project-review-portal-client
   npm run dev
   # Runs on http://localhost:3000
   ```
4. Access the web application at [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deployment (Vercel)

This Next.js application is optimized for deployment on **Vercel**:

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the `project-review-portal-client` directory into Vercel.
3. In the Vercel project settings, configure the environment variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend API URL (e.g., `https://your-server-domain.vercel.app/api/v1`).
4. Click **Deploy**. Vercel will build and deploy the Next.js App Router application automatically.

---

## 📄 License

This project is licensed under the **ISC License**.
