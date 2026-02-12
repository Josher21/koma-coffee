import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Reservation } from "../types/library"
import { useAuth } from "../store/auth-context"
import { reservationService } from "../api/services/reservationService"

function MyReservations() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadReservations() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/reservas" } })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await reservationService.me()
      setReservations(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar tus reservas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [isAuthenticated])

  async function handleCancel(reservationId: number) {
    setActionLoadingId(reservationId)
    setError(null)

    try {
      await reservationService.cancel(reservationId)
      await loadReservations()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cancelar la reserva")
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading) return <p className="p-6">Cargando…</p>
  if (error) return <p className="p-6 text-red-700">{error}</p>

  return (
    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-[var(--ink)]">Mis reservas</h1>

          <div className="text-sm text-[var(--muted)]">
            Total: <span className="font-semibold text-[var(--ink)]">{reservations.length}</span>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-6 text-[var(--muted)]">
            Aún no tienes reservas.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {reservations.map((r) => {
              const book = r.book
              const isActive = r.status === "active"

              return (
                <div
                  key={r.id}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-14 rounded-lg overflow-hidden border border-[var(--line)] bg-white shrink-0">
                      {/* tu API devuelve cover_url, no image */}
                      {book?.image ? (
                        <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xs text-[var(--muted)]">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-[var(--ink)] font-semibold">{book?.title ?? "Libro"}</p>

                      <p className="text-sm text-[var(--muted)]">
                        {r.reserved_at ? `Reservado: ${new Date(r.reserved_at).toLocaleString()}` : ""}
                      </p>

                      <span
                        className={[
                          "mt-2 inline-block text-xs px-2 py-1 rounded-full border",
                          isActive
                            ? "border-green-200 text-green-700 bg-green-50"
                            : "border-slate-200 text-slate-700 bg-white",
                        ].join(" ")}
                      >
                        {isActive ? "Activa" : r.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    {isActive ? (
                      <button
                        onClick={() => handleCancel(r.id)}
                        disabled={actionLoadingId === r.id}
                        className="px-4 py-2 rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-white disabled:opacity-60"
                      >
                        {actionLoadingId === r.id ? "Cancelando…" : "Cancelar"}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-lg border border-[var(--line)] text-[var(--muted)]"
                      >
                        No editable
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default MyReservations