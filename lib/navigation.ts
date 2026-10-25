import {
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileCode2,
  FolderGit2,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users2,
} from "lucide-react"
import { ActiveRole } from "@/types/auth"

export interface NavItem {
  title: string
  href: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  badgeVariant?: "default" | "success" | "warning" | "info"
  highlight?: boolean
}

export const ROLE_NAVIGATION: Record<ActiveRole, NavItem[]> = {
  GUEST: [
    {
      title: "Explore Projects",
      href: "/explore",
      description: "Browse approved peer and student projects across tech stacks",
      icon: Compass,
    },
    {
      title: "How It Works",
      href: "/how-it-works",
      description: "Submit your code, get senior feedback, iterate and level up",
      icon: Sparkles,
    },
    {
      title: "Review Rubric",
      href: "/guidelines",
      description: "Frontend, Backend, and Fullstack architecture benchmarks",
      icon: BookOpen,
    },
    {
      title: "Mentors",
      href: "/mentors",
      description: "Meet industry reviewers from top engineering teams",
      icon: GraduationCap,
    },
  ],
  STUDENT: [
    {
      title: "Dashboard",
      href: "/dashboard/student",
      description: "Overview of your submissions, reviews, and mentor notes",
      icon: LayoutDashboard,
    },
    {
      title: "My Submissions",
      href: "/dashboard/student/submissions",
      description: "Track submission status, approvals, and review feedback",
      icon: FolderGit2,
    },
    {
      title: "Guidelines & Rubric",
      href: "/guidelines",
      description: "Standards and best practices for project reviews",
      icon: BookOpen,
    },
    {
      title: "Explore Archive",
      href: "/explore",
      description: "See exemplary student projects and mentor reviews",
      icon: Compass,
    },
  ],
  MENTOR: [
    {
      title: "Review Queue",
      href: "/submissions",
      description: "Submissions awaiting code review and architectural feedback",
      icon: Clock,
      badge: "3 Pending",
      badgeVariant: "warning",
    },
    {
      title: "Review Analytics",
      href: "/submissions/stats",
      description: "Turnaround time, approval ratios, and review volume",
      icon: TrendingUp,
    },
    {
      title: "Reviewed Archive",
      href: "/submissions/archive",
      description: "Historical record of past evaluated submissions",
      icon: CheckCircle2,
    },
    {
      title: "Rubric Guidelines",
      href: "/guidelines",
      description: "Standardized grading and feedback guidelines",
      icon: BookOpen,
    },
  ],
  ADMIN: [
    {
      title: "Overview",
      href: "/admin",
      description: "Platform high-level health and activity overview",
      icon: LayoutDashboard,
    },
    {
      title: "All Submissions",
      href: "/admin/submissions",
      description: "System-wide view of all student code submissions",
      icon: FolderGit2,
    },
    {
      title: "User Management",
      href: "/admin/users",
      description: "Manage students, mentors, permissions, and roles",
      icon: Users2,
    },
    {
      title: "Platform Stats",
      href: "/admin/stats",
      description: "Detailed system telemetry and submission throughput",
      icon: TrendingUp,
    },
  ],
}

export interface QuickSearchItem {
  id: string
  title: string
  subtitle: string
  category: "Submissions" | "Pages" | "Stacks" | "Actions"
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export const SEARCH_INDEX: QuickSearchItem[] = [
  {
    id: "submit-new",
    title: "Submit New Project",
    subtitle: "Upload Git repository, live demo link, and description",
    category: "Actions",
    href: "/submissions/new",
    icon: PlusCircle,
  },
  {
    id: "my-submissions",
    title: "My Submissions",
    subtitle: "Check review status, mentor remarks, and approval",
    category: "Submissions",
    href: "/submissions/my",
    icon: FolderGit2,
  },
  {
    id: "review-queue",
    title: "Review Queue",
    subtitle: "Mentor evaluation queue for pending projects",
    category: "Submissions",
    href: "/submissions",
    icon: Clock,
  },
  {
    id: "stack-fullstack",
    title: "Fullstack Projects",
    subtitle: "React/Next.js + Node.js/Express + Prisma + PostgreSQL",
    category: "Stacks",
    href: "/explore?stack=Fullstack",
    icon: FileCode2,
  },
  {
    id: "stack-frontend",
    title: "Frontend Projects",
    subtitle: "Next.js, TailwindCSS, React 19, TypeScript UI/UX",
    category: "Stacks",
    href: "/explore?stack=Frontend",
    icon: FileCode2,
  },
  {
    id: "stack-backend",
    title: "Backend APIs",
    subtitle: "RESTful & GraphQL services, Prisma ORM, Auth & Security",
    category: "Stacks",
    href: "/explore?stack=Backend",
    icon: FileCode2,
  },
  {
    id: "review-guidelines",
    title: "Project Review Guidelines",
    subtitle: "Read code style, architecture, and documentation rubrics",
    category: "Pages",
    href: "/guidelines",
    icon: BookOpen,
  },
  {
    id: "user-management",
    title: "Admin User Management",
    subtitle: "Manage accounts, promote mentors, review privileges",
    category: "Pages",
    href: "/admin/users",
    icon: ShieldCheck,
  },
  {
    id: "help-center",
    title: "Help & FAQs",
    subtitle: "Learn how the review submission and approval lifecycle works",
    category: "Pages",
    href: "/how-it-works",
    icon: HelpCircle,
  },
]
