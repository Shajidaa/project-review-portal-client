"use client"

import * as React from "react"
import { userApi } from "@/lib/user-api"
import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/types/user"
import type { Gender } from "@/types/user"
import {
    AlertCircle,
    Camera,
    CheckCircle2,
    Loader2,
    Mail,
    ShieldCheck,
    User as UserIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRoleBadge } from "@/components/dashboard/UserRoleBadge"

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export default function ProfilePage() {
    const { refreshUser } = useAuth()

    const [profile, setProfile] = React.useState<User | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [saving, setSaving] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // form state
    const [name, setName] = React.useState("")
    const [avatarUrl, setAvatarUrl] = React.useState("")
    const [gender, setGender] = React.useState<Gender | "">("")

    // avatar preview — shows typed URL instantly
    const previewAvatar = avatarUrl.trim() || profile?.avatarUrl || ""

    React.useEffect(() => {
        userApi.getMe().then((res) => {
            const u = res.data
            setProfile(u)
            setName(u.name)
            setAvatarUrl(u.avatarUrl ?? "")
            setGender(u.gender ?? "")
        }).catch((e) => setError((e as Error).message))
            .finally(() => setLoading(false))
    }, [])

    const isDirty =
        name.trim() !== (profile?.name ?? "") ||
        avatarUrl.trim() !== (profile?.avatarUrl ?? "") ||
        gender !== (profile?.gender ?? "")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isDirty) return
        setError(null)
        setSuccess(false)
        setSaving(true)

        try {
            const payload: Record<string, string> = {}
            if (name.trim() !== profile?.name) payload.name = name.trim()
            if (avatarUrl.trim() !== (profile?.avatarUrl ?? "")) payload.avatarUrl = avatarUrl.trim() || ""
            if (gender !== (profile?.gender ?? "")) payload.gender = gender

            const res = await userApi.updateMe(payload)
            setProfile(res.data)
            setName(res.data.name)
            setAvatarUrl(res.data.avatarUrl ?? "")
            setGender(res.data.gender ?? "")
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
            // sync navbar avatar / name
            await refreshUser()
        } catch (err: unknown) {
            setError((err as Error).message ?? "Failed to save changes")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
    )

    return (
        <div className="mx-auto space-y-6">

            {/* ── Header ── */}
            <div>
                <h1 className="text-xl font-bold text-foreground">My Profile</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Manage your personal information and avatar.
                </p>
            </div>

            {/* ── Profile card (read-only summary) ── */}
            <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                <div className="relative shrink-0">
                    <Avatar className="size-16">
                        {previewAvatar && <AvatarImage src={previewAvatar} alt={name} />}
                        <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                            {getInitials(name || profile?.name || "?")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                        <Camera className="size-3" />
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-base font-bold text-foreground truncate">{profile?.name}</p>
                        {profile && <UserRoleBadge role={profile.role} />}
                        {profile?.emailVerified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-3" /> Verified
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 truncate">{profile?.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Member since {profile ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
                    </p>
                </div>
            </div>

            {/* ── Read-only info rows ── */}
            <div className="rounded-xl border border-border bg-card divide-y divide-border px-4">
                {[
                    { icon: Mail, label: "Email", value: profile?.email },
                    { icon: ShieldCheck, label: "Role", value: <UserRoleBadge role={profile!.role} /> },
                    { icon: UserIcon, label: "Auth Provider", value: profile?.authProvider },
                ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 py-3">
                        <Icon className="size-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">{label}</p>
                            <div className="text-sm font-medium text-foreground mt-0.5">{value}</div>
                        </div>
                        <span className="text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5 shrink-0">
                            read-only
                        </span>
                    </div>
                ))}
            </div>

            {/* ── Edit form ── */}
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-5 space-y-5">
                <p className="text-sm font-semibold text-foreground">Edit Profile</p>

                {/* Feedback */}
                {error && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                        <span>Profile updated successfully.</span>
                    </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        minLength={2}
                        required
                    />
                </div>

                {/* Avatar URL */}
                <div className="space-y-1.5">
                    <Label htmlFor="avatarUrl">
                        Avatar URL <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                    </Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="avatarUrl"
                            type="url"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/your-photo.jpg"
                            className="flex-1"
                        />
                        {previewAvatar && (
                            <Avatar className="size-9 shrink-0">
                                <AvatarImage src={previewAvatar} alt="preview" />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {getInitials(name)}
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Paste a direct image URL. Preview updates as you type.
                    </p>
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                    <Label>Gender <span className="text-muted-foreground text-xs font-normal">(optional)</span></Label>
                    <div className="flex gap-3">
                        {(["MALE", "FEMALE"] as const).map((g) => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => setGender(g)}
                                className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all cursor-pointer ${gender === g
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                    }`}
                            >
                                {g.charAt(0) + g.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-1">
                    <Button
                        type="submit"
                        size="sm"
                        disabled={saving || !isDirty}
                        className="gap-2 cursor-pointer min-w-[110px]"
                    >
                        {saving
                            ? <><Loader2 className="size-4 animate-spin" /> Saving…</>
                            : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
