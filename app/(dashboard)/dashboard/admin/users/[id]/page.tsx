"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { userApi } from "@/lib/user-api"
import type { User } from "@/types/user"
import type { UserRole } from "@/types/auth"
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Loader2,
    Mail,
    ShieldCheck,
    Trash2,
    User as UserIcon,
    XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserRoleBadge } from "@/components/dashboard/UserRoleBadge"
import { useAuth } from "@/contexts/auth-context"

const ROLES: UserRole[] = ["STUDENT", "MENTOR", "ADMIN"]

function InfoRow({ icon: Icon, label, value }: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: React.ReactNode
}) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
            <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="text-sm font-medium text-foreground mt-0.5">{value}</div>
            </div>
        </div>
    )
}

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export default function AdminUserDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const { user: me } = useAuth()

    const [user, setUser] = React.useState<User | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [newRole, setNewRole] = React.useState<UserRole | "">("")
    const [roleLoading, setRoleLoading] = React.useState(false)
    const [roleSuccess, setRoleSuccess] = React.useState(false)
    const [roleError, setRoleError] = React.useState<string | null>(null)
    const [deleting, setDeleting] = React.useState(false)

    React.useEffect(() => {
        userApi.getById(id)
            .then((res) => {
                setUser(res.data)
                setNewRole(res.data.role)
            })
            .catch((e) => setError((e as Error).message))
            .finally(() => setLoading(false))
    }, [id])

    const handleRoleUpdate = async () => {
        if (!newRole || !user || newRole === user.role) return
        setRoleLoading(true)
        setRoleError(null)
        setRoleSuccess(false)
        try {
            const res = await userApi.updateRole(id, { role: newRole })
            setUser(res.data)
            setRoleSuccess(true)
            setTimeout(() => setRoleSuccess(false), 2500)
        } catch (e: unknown) {
            setRoleError((e as Error).message ?? "Failed to update role")
        } finally {
            setRoleLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!user) return
        if (!confirm(`Permanently delete "${user.name}"? This cannot be undone.`)) return
        setDeleting(true)
        try {
            await userApi.delete(id)
            router.push("/dashboard/admin/users")
        } catch (e: unknown) {
            alert((e as Error).message ?? "Failed to delete user")
            setDeleting(false)
        }
    }

    if (loading) return (
        <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
    )

    if (error || !user) return (
        <div className="max-w-2xl space-y-4">
            <Link href="/dashboard/admin/users" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-3.5" /> Back to users
            </Link>
            <p className="text-sm text-destructive">{error ?? "User not found."}</p>
        </div>
    )

    const isSelf = me?.id === user.id

    return (
        <div className="mx-auto space-y-6">

            {/* Back */}
            <Link href="/dashboard/admin/users" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="size-3.5" /> Back to users
            </Link>

            {/* Header card */}
            <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                <Avatar className="size-14 shrink-0">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                    <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-lg font-bold text-foreground truncate">{user.name}</h1>
                        <UserRoleBadge role={user.role} />
                        {user.emailVerified
                            ? <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="size-3" /> Verified</span>
                            : <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-500"><XCircle className="size-3" /> Unverified</span>
                        }
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 truncate">{user.email}</p>
                </div>
            </div>

            {/* Details */}
            <div className="rounded-xl border border-border bg-card px-4 divide-y divide-border">
                <InfoRow icon={UserIcon} label="Full Name" value={user.name} />
                <InfoRow icon={Mail} label="Email" value={user.email} />
                <InfoRow icon={ShieldCheck} label="Role" value={<UserRoleBadge role={user.role} />} />
                <InfoRow icon={UserIcon} label="Gender" value={user.gender ? user.gender.charAt(0) + user.gender.slice(1).toLowerCase() : "—"} />
                <InfoRow icon={UserIcon} label="Auth Provider" value={user.authProvider} />
                <InfoRow icon={Calendar} label="Joined" value={new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                <InfoRow icon={Calendar} label="Last updated" value={new Date(user.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
            </div>

            {/* Role Management */}
            {!isSelf && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-foreground">Change Role</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Updating this will immediately change what the user can access.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex gap-2">
                            {ROLES.map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setNewRole(r)}
                                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${newRole === r
                                        ? r === "STUDENT" ? "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                                            : r === "MENTOR" ? "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                                : "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                        }`}
                                >
                                    {r.charAt(0) + r.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                        <Button
                            size="sm"
                            onClick={handleRoleUpdate}
                            disabled={!newRole || newRole === user.role || roleLoading}
                            className="h-8 text-xs cursor-pointer"
                        >
                            {roleLoading ? <Loader2 className="size-3.5 animate-spin mr-1" /> : null}
                            {roleLoading ? "Saving…" : "Save Role"}
                        </Button>
                    </div>
                    {roleSuccess && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="size-3.5" /> Role updated successfully
                        </p>
                    )}
                    {roleError && (
                        <p className="text-xs text-destructive">{roleError}</p>
                    )}
                </div>
            )}

            {/* Danger Zone */}
            {!isSelf && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-destructive">Danger Zone</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Permanently deletes this user and all associated data. This action cannot be undone.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5 cursor-pointer"
                    >
                        {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                        {deleting ? "Deleting…" : "Delete User"}
                    </Button>
                </div>
            )}

            {isSelf && (
                <p className="text-xs text-muted-foreground text-center">
                    You cannot modify or delete your own account from here.
                </p>
            )}
        </div>
    )
}
