import { api } from "../apiClient"
import type { AuthUser } from "../../types/auth"

/** Este será el “puente” para sustituir el login mock por login real sin tocar media app. */

export type LoginRequest = {
  email: string
  password: string
}

export type AuthResponse = {
  message?: string
  token: string
  user: AuthUser
}

export type RegisterRequest = {
  name: string
  email: string
  password: string
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/register", payload, { auth: false })
}


// Laravel esperado (cuando lo montes):
// POST /api/auth/login -> { token, user }
export async function login(payload: LoginRequest): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/login", payload, { auth: false })
}

// POST /api/auth/logout (protegido) -> { ok: true }
export async function logout(): Promise<{ ok: boolean }> {
  return api.post<{ ok: boolean }>("/auth/logout")
}

// GET /api/auth/user (protegido) -> user
export async function me(): Promise<AuthUser> {
  return api.get<AuthUser>("/auth/user")
}
