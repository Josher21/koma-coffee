import type { AuthState } from "../types/auth"

const KEY = "koma_auth"

export function loadAuth(): AuthState {
  const raw = sessionStorage.getItem(KEY)
  if (!raw) return { token: null, user: null }
  try {
    return JSON.parse(raw) as AuthState
  } catch {
    return { token: null, user: null }
  }
}

export function saveAuth(state: AuthState) {
  sessionStorage.setItem(KEY, JSON.stringify(state))
}

export function clearAuth() {
  sessionStorage.removeItem(KEY)
}
