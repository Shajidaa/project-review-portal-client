export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

export interface ApiResponse<T = unknown> {
  statusCode: number
  success: boolean
  message: string
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  errorSources?: Array<{ path: string; message: string }>
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface VerifyEmailPayload {
  email: string
  otp: string
}

export interface ResendOtpPayload {
  email: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  role: "STUDENT" | "MENTOR" | "ADMIN"
  emailVerified: boolean
  avatarUrl?: string | null
}

// Token helper functions
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("accessToken")
}

export const setAccessToken = (token: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("accessToken", token)
}

export const removeTokens = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("user")
}

// Core fetch helper
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAccessToken()
  const headers = new Headers(options.headers || {})

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Supports server-set httpOnly cookies
  })

  let payload: ApiResponse<T>

  try {
    payload = await response.json()
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status} ${response.statusText})`
    )
  }

  if (!response.ok || payload.success === false) {
    let errorMsg = payload.message || "An unexpected error occurred"
    if (payload.errorSources && payload.errorSources.length > 0) {
      errorMsg = payload.errorSources.map((e) => e.message).join(". ")
    }
    const error = new Error(errorMsg) as Error & {
      statusCode?: number
      raw?: ApiResponse<T>
    }
    error.statusCode = payload.statusCode || response.status
    error.raw = payload
    throw error
  }

  return payload
}

// Auth API Methods
export const authApi = {
  register: (data: RegisterPayload) =>
    apiRequest<{ email: string; name: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyEmail: (data: VerifyEmailPayload) =>
    apiRequest<AuthTokens>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resendOtp: (data: ResendOtpPayload) =>
    apiRequest<{ email: string }>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginPayload) =>
    apiRequest<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest<null>("/auth/logout", {
      method: "POST",
    }),

  forgotPassword: (data: { email: string }) =>
    apiRequest<null>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    apiRequest<null>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () =>
    apiRequest<CurrentUser>("/users/me", {
      method: "GET",
    }),
}
