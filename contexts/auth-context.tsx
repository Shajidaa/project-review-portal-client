"use client"

import * as React from "react"
import { authApi, CurrentUser, getAccessToken, removeTokens } from "@/lib/api"

interface AuthContextValue {
    user: CurrentUser | null
    isLoading: boolean
    refreshUser: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<CurrentUser | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchUser = React.useCallback(async () => {
        if (!getAccessToken()) {
            setUser(null)
            setIsLoading(false)
            return
        }
        try {
            const res = await authApi.getMe()
            setUser(res.data)
        } catch {
            setUser(null)
            removeTokens()
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const refreshUser = React.useCallback(async () => {
        setIsLoading(true)
        await fetchUser()
    }, [fetchUser])

    const logout = React.useCallback(async () => {
        try {
            await authApi.logout()
        } catch {
            // best effort
        } finally {
            removeTokens()
            setUser(null)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = React.useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}
