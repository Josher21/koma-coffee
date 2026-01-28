import { useEffect, useState } from "react"
import { healthService } from "../api/services"
import type { HealthResponse } from "../api/services/healthService"

function ApiStatus() {
  const [data, setData] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    healthService
      .getHealth()
      .then(setData)
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Error desconocido")
      })
  }, [])

  return (
    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">API Status</h1>
        <p className="mt-2 text-[var(--muted)]">
          Comprobación de conexión React → Laravel (CORS + endpoint /api/health).
        </p>

        <div className="mt-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-6">
          {!data && !error && <p className="text-[var(--muted)]">Comprobando…</p>}

          {data && (
            <div className="space-y-2">
              <p className="text-[var(--ink)] font-semibold">✅ Conectado</p>
              <p className="text-[var(--muted)]">
                App: <span className="text-[var(--ink)]">{data.app}</span>
              </p>
              <p className="text-[var(--muted)]">
                Time: <span className="text-[var(--ink)]">{data.time}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="space-y-2">
              <p className="text-red-700 font-semibold">❌ Error</p>
              <p className="text-[var(--muted)]">{error}</p>
              <p className="text-[var(--muted)] text-sm">
                Si esto ocurre, suele ser por CORS o por `VITE_API_URL` mal configurada.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ApiStatus
