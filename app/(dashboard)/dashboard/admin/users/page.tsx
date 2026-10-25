"use client"

import * as React from "react"
import Link from "next/link"
import { userApi } from "@/lib/user-api"
import type { User, UserQuery } from "@/types/user"
import type { UserRole } from "@/types/auth"
import { Search, SlidersHorizontal, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserRoleBadge } from "@/components/dashboard/UserRoleBadge"

const ROLE_OPTS: { label: string; value: UserRole | "" }[] = [
    { label: "All Roles", value: "" },
    { label: "Student", value: "STUDENT" },
    { label: "Mentor", value: "MENTOR" },
    { label: "Admin", value: "ADMIN" },
]

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export default function AdminUsersPage() {
    const [users, setUsers] = React.useState<User[]>([])
    const [meta, setMeta] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
    const [loading, setLoading] = React.useState(true)
    const [page, setPage] = React.useState(1)
    const [searchInput, setSearchInput] = React.useState("")
    const [search, setSearch] = React.useState("")
    const [role, setRole] = React.useState<UserRole | "">("")
    const [deletingId, setDeletingId] = React.useState<string | null>(null)

    const fetchUsers = React.useCallback(async () => {
        setLoading(true)
        try {
            const query: UserQuery = { page, limit: 10 }
            if (search) query.search = search
            if (role) query.role = role
            const res = await userApi.getAll(query)
            setUsers(res.data)
            setMeta(res.meta ?? { page, limit: 10, total: res.data.length, totalPages: 1 })
        } catch {
            setUsers([])
        } finally {
            setLoading(false)
        }
    }, [page, search, role])

    React.useEffect(() => { fetchUsers() }, [fetchUsers])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setSearch(searchInput)
        setPage(1)
    }

    const clearFilters = () => {
        setSearch(""); setSearchInput(""); setRole(""); setPage(1)
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return
        setDeletingId(id)
        try {
            await userApi.delete(id)
            setUsers((prev) => prev.filter((u) => u.id !== id))
            setMeta((prev) => ({ ...prev, total: prev.total - 1 }))
        } catch (e: unknown) {
            alert((e as Error).message ?? "Failed to delete user")
        } finally {
            setDeletingId(null)
        }
    }

    const hasFilters = search || role

    return (
        <div className="max-w-5xl space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-foreground">User Management</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {loading ? "Loading…" : `${meta.total} registered user${meta.total !== 1 ? "s" : ""}`}
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <Input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search name or email…"
                            className="pl-8 h-8 text-xs"
                        />
                    </div>
                    <Button type="submit" size="sm" variant="outline" className="h-8 cursor-pointer">
                        <Search className="size-3.5" />
                    </Button>
                </form>

                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                    <select
                        value={role}
                        onChange={(e) => { setRole(e.target.value as UserRole | ""); setPage(1) }}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    >
                        {ROLE_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {hasFilters && (
                        <Button size="sm" variant="ghost" onClick={clearFilters} className="h-8 text-xs gap-1 text-muted-foreground cursor-pointer">
                            <X className="size-3.5" /> Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-16 rounded-xl border border-border bg-card animate-pulse" />
                    ))}
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-14 text-center">
                    <p className="text-sm font-medium text-foreground">No users found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                    {users.map((u) => (
                        <div key={u.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/40 transition-colors group">

                            {/* Avatar */}
                            <Avatar className="size-9 shrink-0">
                                {u.avatarUrl && <AvatarImage src={u.avatarUrl} alt={u.name} />}
                                <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                                    {getInitials(u.name)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Link
                                        href={`/dashboard/admin/users/${u.id}`}
                                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate"
                                    >
                                        {u.name}
                                    </Link>
                                    <UserRoleBadge role={u.role} />
                                    {u.emailVerified && (
                                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">{u.email}</p>
                            </div>

                            {/* Meta */}
                            <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
                                <p className="text-xs text-muted-foreground">
                                    Joined {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                </p>
                                {u.gender && (
                                    <p className="text-[11px] text-muted-foreground capitalize">{u.gender.toLowerCase()}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                                <Button asChild size="sm" variant="outline" className="h-7 text-xs cursor-pointer">
                                    <Link href={`/dashboard/admin/users/${u.id}`}>View</Link>
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDelete(u.id, u.name)}
                                    disabled={deletingId === u.id}
                                    title="Delete user"
                                    className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                >
                                    <Trash2 className="size-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground">
                        Page {meta.page} of {meta.totalPages} · {meta.total} total
                    </p>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setPage((p) => p - 1)} disabled={page <= 1 || loading} className="h-8 text-xs cursor-pointer">
                            Previous
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page >= meta.totalPages || loading} className="h-8 text-xs cursor-pointer">
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
