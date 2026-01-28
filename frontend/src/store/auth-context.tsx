import { createContext, useContext, useMemo, useState } from "react"
import type { AuthState } from "../types/auth"
import { clearAuth, loadAuth, saveAuth } from "./authStorage"
import { authService } from "../api/services"

type AuthContextValue = {
  auth: AuthState
  isAuthenticated: boolean
  role: AuthState["user"] extends null ? null : any
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => loadAuth())

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
    // intentamos avisar al backend (si falla, igualmente cerramos sesión en front)
    try {
      await authService.logout()
    } catch {
      // silencioso por ahora
    }

    setAuth({ token: null, user: null })
    clearAuth()
  }

  const value = useMemo(() => {
    const isAuthenticated = !!auth.token
    const role = auth.user?.role ?? null
    return { auth, isAuthenticated, role, login, logout }
  }, [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
