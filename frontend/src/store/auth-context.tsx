import { createContext, useContext, useMemo, useState } from "react"
import type { AuthState, Role } from "../types/auth"
import { clearAuth, loadAuth, saveAuth } from "./authStorage"

type AuthContextValue = {
  auth: AuthState
  isAuthenticated: boolean
  role: Role | null
  loginMockAs: (role: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => loadAuth())

  const value = useMemo<AuthContextValue>(() => {
    const isAuthenticated = !!auth.token
    const role = auth.user?.role ?? null

    function loginMockAs(r: Role) {
      const next: AuthState = {
        token: "mock-token",
        user: { id: 1, name: "Jose Luis", email: "test@koma.local", role: r },
      }
      setAuth(next)
      saveAuth(next)
    }

    function logout() {
      setAuth({ token: null, user: null })
      clearAuth()
    }

    return { auth, isAuthenticated, role, loginMockAs, logout }
  }, [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
