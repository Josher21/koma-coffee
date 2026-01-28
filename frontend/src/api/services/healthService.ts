import { api } from "../apiClient"

/** Esto sirve para comprobar que el front “habla” con el back */

export type HealthResponse = {
  ok: boolean
  app?: string
  time?: string
}

export async function getHealth(): Promise<HealthResponse> {
  // Ojo: esta ruta tiene que existir en Laravel: GET /api/health
  return api.get<HealthResponse>("/health", { auth: false })
}