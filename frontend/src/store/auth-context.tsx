import { createContext, useContext, useMemo, useState } from "react"
import type { AuthState, AuthUser, Role } from "../types/auth"
import { clearAuth, loadAuth, saveAuth } from "./authStorage"
import { authService } from "../api/services"

type AuthContextValue = {
  auth: AuthState
  isAuthenticated: boolean
  user: AuthUser | null
  role: Role | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => loadAuth())

  async function register(name: string, email: string, password: string) {
    const res = await authService.register({ name, email, password })

    const next: AuthState = {
      token: res.token,
      user: res.user,
    }

    setAuth(next)
    saveAuth(next)
  }

  async function login(email: string, password: string) {
    const res = await authService.login({ email, password })

    const next: AuthState = {
      token: res.token,
      user: res.user,
    }

    setAuth(next)
    saveAuth(next)
  }

  async function logout() {
    try {
      await authService.logout()
    } catch {
      // silencioso
    }

    setAuth({ token: null, user: null })
    clearAuth()
  }

  const value = useMemo<AuthContextValue>(() => {
    const isAuthenticated = !!auth.token
    const user: AuthUser | null = auth.user ?? null
    const role: Role | null = user?.role ?? null

    return {
      auth,
      isAuthenticated,
      user,   // ✅ FALTABA
      role,   // ✅
      login,
      register,
      logout,
    }
  }, [auth, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}