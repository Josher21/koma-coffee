import { createContext, useContext, useMemo, useState } from "react"
import type { AuthState, AuthUser, Role } from "../types/auth"
import { clearAuth, loadAuth, saveAuth } from "./authStorage"
import { authService } from "../api/services"   // Laravel API

// Definimos qué datos y funciones tendrá disponible el contexto de autenticación
type AuthContextValue = {
  auth: AuthState
  isAuthenticated: boolean
  user: AuthUser | null
  role: Role | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// Creamos el contexto (inicialmente null hasta que lo provea el Provider)
const AuthContext = createContext<AuthContextValue | null>(null)

// Provider: envuelve la aplicación y hace que el estado de autenticación
// esté disponible en cualquier componente.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => loadAuth())

  // Llamada al backend (Laravel) para registrar usuario
  async function register(name: string, email: string, password: string) {
    const res = await authService.register({ name, email, password })

    // Construimos el nuevo estado de autenticación
    const next: AuthState = {
      token: res.token,
      user: res.user,
    }

    setAuth(next)     // Actualizamos estado en memoria (React)
    saveAuth(next)    // Guardamos en localStorage para mantener sesión al recargar
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
      // Si falla, no bloqueamos el logout en frontend
    }

    setAuth({ token: null, user: null })    // Limpiamos el estado en memoria
    clearAuth()                             // Limpiamos localStorage
  }

  const value = useMemo<AuthContextValue>(() => {
    const isAuthenticated = !!auth.token
    const user: AuthUser | null = auth.user ?? null
    const role: Role | null = user?.role ?? null

    return {
      auth,
      isAuthenticated,
      user,   
      role,   
      login,
      register,
      logout,
    }
  }, [auth, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para usar la autenticación fácilmente en cualquier componente
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}