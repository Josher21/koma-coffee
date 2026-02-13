import type { AuthState } from "../types/auth"
// Clave que usaremos para guardar la información en el navegador.
const KEY = "koma_auth"

// Cargar autenticación desde el navegador
export function loadAuth(): AuthState {
  const raw = sessionStorage.getItem(KEY)

  if (!raw) return { token: null, user: null }

  try {
    return JSON.parse(raw) as AuthState   // Convertimos el texto guardado (JSON) a objeto JavaScript
  } catch {
    return { token: null, user: null }
  }
}

export function saveAuth(state: AuthState) {
  sessionStorage.setItem(KEY, JSON.stringify(state))    // Convertimos el objeto a texto JSON y lo guardamos
}

export function clearAuth() {
  sessionStorage.removeItem(KEY)    // Eliminamos la clave
}
