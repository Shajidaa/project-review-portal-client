"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { submissionApi } from "@/lib/submission-api"
import type { CreateSubmissionPayload, ProjectType, RepoStack } from "@/types/submission"
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const PROJECT_TYPES: { label: string; value: ProjectType }[] = [
    { label: "Web", value: "WEB" },
    { label: "Mobile", value: "MOBILE" },
    { label: "Other", value: "OTHER" },
]

const REPO_STACKS: { label: string; value: RepoStack }[] = [
    { label: "Frontend", value: "Frontend" },
    { label: "Backend", value: "Backend" },
    { label: "Fullstack", value: "Fullstack" },
    { label: "Mobile", value: "Mobile" },
    { label: "Other", value: "Other" },
]

const INITIAL: CreateSubmissionPayload = {
    projectName: "",
    projectType: "WEB",
    repoUrl: "",
    liveLink: "",
    description: "",
    repoStack: "Fullstack",
    projectImage: "",
}

export default function NewSubmissionPage() {
    const router = useRouter()
    const [form, setForm] = React.useState<CreateSubmissionPayload>(INITIAL)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState(false)

    const set = (field: keyof CreateSubmissionPayload) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm((prev) => ({ ...prev, [field]: e.target.value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const payload: CreateSubmissionPayload = { ...form }
            if (!payload.projectImage) delete payload.projectImage
            await submissionApi.create(payload)
            setSuccess(true)
            setTimeout(() => router.push("/dashboard/student/submissions"), 1500)
        } catch (err: unknown) {
            setError((err as Error).message ?? "Failed to submit project")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto space-y-6">
            {/* Back + Header */}
            <div className="space-y-1">
                <Link
                    href="/dashboard/student/submissions"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
                >
                    <ArrowLeft className="size-3.5" /> Back to submissions
                </Link>
                <h1 className="text-xl font-bold text-foreground">Submit a Project</h1>
                <p className="text-sm text-muted-foreground">
                    Fill in the details below. A mentor will review your submission.
                </p>
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                    <span>Submitted successfully! Redirecting…</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-5">
                {/* Project Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="projectName">Project Name <span className="text-destructive">*</span></Label>
                    <Input
                        id="projectName"
                        placeholder="e.g. E-Commerce Dashboard"
                        value={form.projectName}
                        onChange={set("projectName")}
                        required
                        minLength={3}
                        maxLength={100}
                    />
                </div>

                {/* Project Type + Stack — 2 cols */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="projectType">Project Type <span className="text-destructive">*</span></Label>
                        <select
                            id="projectType"
                            value={form.projectType}
                            onChange={set("projectType")}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                            required
                        >
                            {PROJECT_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="repoStack">Tech Stack <span className="text-destructive">*</span></Label>
                        <select
                            id="repoStack"
                            value={form.repoStack}
                            onChange={set("repoStack")}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                            required
                        >
                            {REPO_STACKS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Repo URL */}
                <div className="space-y-1.5">
                    <Label htmlFor="repoUrl">Repository URL <span className="text-destructive">*</span></Label>
                    <Input
                        id="repoUrl"
                        type="url"
                        placeholder="https://github.com/username/repo"
                        value={form.repoUrl}
                        onChange={set("repoUrl")}
                        required
                    />
                    <p className="text-xs text-muted-foreground">GitHub, GitLab, or Bitbucket only.</p>
                </div>

                {/* Live Link */}
                <div className="space-y-1.5">
                    <Label htmlFor="liveLink">Live Demo URL <span className="text-destructive">*</span></Label>
                    <Input
                        id="liveLink"
                        type="url"
                        placeholder="https://myproject.vercel.app"
                        value={form.liveLink}
                        onChange={set("liveLink")}
                        required
                    />
                </div>

                {/* Project Image (optional) */}
                <div className="space-y-1.5">
                    <Label htmlFor="projectImage">Project Image URL <span className="text-muted-foreground text-xs font-normal">(optional)</span></Label>
                    <Input
                        id="projectImage"
                        type="url"
                        placeholder="https://example.com/screenshot.png"
                        value={form.projectImage}
                        onChange={set("projectImage")}
                    />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                    <textarea
                        id="description"
                        rows={5}
                        placeholder="Describe your project: what it does, tech choices, challenges you faced… (min 20 characters)"
                        value={form.description}
                        onChange={set("description")}
                        required
                        minLength={20}
                        maxLength={2000}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">{form.description.length} / 2000</p>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button asChild variant="outline" size="sm" className="cursor-pointer">
                        <Link href="/dashboard/student/submissions">Cancel</Link>
                    </Button>
                    <Button type="submit" size="sm" disabled={loading || success} className="gap-2 cursor-pointer">
                        {loading ? <><Loader2 className="size-4 animate-spin" /> Submitting…</> : "Submit Project"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
