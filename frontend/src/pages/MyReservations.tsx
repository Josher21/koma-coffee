import { useEffect, useMemo, useState } from "react"
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

  // ✅ Filtro (escalable)
  const [onlyActive, setOnlyActive] = useState(false)

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
    if (!confirm("¿Cancelar esta reserva?")) return

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

  const filteredReservations = useMemo(() => {
    const base = onlyActive ? reservations.filter(r => r.status === "active") : reservations
    // opcional: activas primero siempre
    return [...base].sort((a, b) => (a.status === b.status ? 0 : a.status === "active" ? -1 : 1))
  }, [reservations, onlyActive])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#120c07]">
        <div className="mx-auto max-w-6xl px-4 py-10 pb-16">
          <div className="rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/55 to-[#1a120a]/70 p-6 text-[#f5ede0]/70">
            Cargando…
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#120c07]">
      <div className="mx-auto max-w-6xl px-4 py-10 pb-16">
        {/* Header sección */}
        <div className="mb-2">
          <p className="text-[0.67rem] font-medium uppercase tracking-[0.22em] text-[#c8922a]">
            Reservas
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-serif text-2xl font-bold text-[#f5ede0] md:text-3xl">
              Mis reservas
            </h1>

            <div className="text-xs font-medium uppercase tracking-[0.14em] text-[#f5ede0]/50">
              Mostrando{" "}
              <span className="text-[#e5b56a]">{filteredReservations.length}</span>
            </div>
          </div>
        </div>

        {/* Divider ornamental */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#c8922a]/50" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* ✅ MENÚ LATERAL */}
          <aside className="h-fit rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/45 to-[#1a120a]/65 p-5 shadow-xl shadow-black/30">
            <h2 className="font-serif text-lg font-bold text-[#f5ede0]">Filtros</h2>
            <p className="mt-1 text-sm font-serif italic text-[#f5ede0]/55">
              Ajusta qué reservas quieres ver.
            </p>

            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-3 text-sm text-[#f5ede0]/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!onlyActive}
                  onChange={() => setOnlyActive(false)}
                  className="h-4 w-4 accent-[#c8922a]"
                />
                Todas
              </label>

              <label className="flex items-center gap-3 text-sm text-[#f5ede0]/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyActive}
                  onChange={() => setOnlyActive(true)}
                  className="h-4 w-4 accent-[#c8922a]"
                />
                Solo activas
              </label>
            </div>

            <button
              onClick={() => setOnlyActive(false)}
              className="mt-6 w-full rounded-full border border-[#c8922a]/25 bg-[#c8922a]/5 px-4 py-2 text-sm font-semibold text-[#e5b56a]
                         transition hover:bg-[#c8922a]/20 hover:border-[#c8922a]/50 hover:text-[#f5ede0]"
            >
              Limpiar filtros
            </button>
          </aside>

          {/* ✅ CONTENIDO */}
          <section>
            {filteredReservations.length === 0 ? (
              <div className="rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/35 to-[#1a120a]/60 p-6 text-[#f5ede0]/60">
                No hay reservas para el filtro seleccionado.
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredReservations.map((r) => {
                  const book = r.book
                  const isActive = r.status === "active"

                  return (
                    <div
                      key={r.id}
                      className="group relative overflow-hidden rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/45 to-[#1a120a]/65 p-5
                                 transition hover:-translate-y-0.5 hover:border-[#c8922a]/30 hover:shadow-xl hover:shadow-black/40"
                    >
                      {/* shimmer hover */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8922a]/40 to-transparent opacity-0 transition group-hover:opacity-100" />

                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="h-20 w-14 shrink-0 overflow-hidden rounded-xl border border-[#c8922a]/15 bg-[#f5ede0]/5">
                            {book?.image ? (
                              <img
                                src={book.image}
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[0.7rem] text-[#f5ede0]/40">
                                Sin imagen
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-serif text-lg font-bold leading-snug text-[#f5ede0]">
                              {book?.title ?? "Libro"}
                            </p>

                            <p className="mt-1 font-serif text-sm italic leading-relaxed text-[#f5ede0]/55">
                              {r.reserved_at
                                ? `Reservado: ${new Date(r.reserved_at).toLocaleString()}`
                                : ""}
                            </p>

                            <span
                              className={[
                                "mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
                                isActive
                                  ? "border-[#c8922a]/35 bg-[#c8922a]/10 text-[#e5b56a]"
                                  : "border-[#f5ede0]/15 bg-[#f5ede0]/5 text-[#f5ede0]/55",
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "h-1.5 w-1.5 rounded-full",
                                  isActive ? "bg-[#c8922a]" : "bg-[#f5ede0]/35",
                                ].join(" ")}
                                aria-hidden
                              />
                              {isActive ? "Activa" : "Cancelada"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          {isActive ? (
                            <button
                              onClick={() => handleCancel(r.id)}
                              disabled={actionLoadingId === r.id}
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#c8922a]/35 bg-[#c8922a]/10 px-5 py-2 text-sm font-semibold text-[#e5b56a]
                                         transition hover:bg-[#c8922a]/25 hover:border-[#c8922a] hover:text-[#f5ede0] disabled:opacity-60"
                            >
                              {actionLoadingId === r.id ? "Cancelando…" : "Cancelar"}{" "}
                              <span aria-hidden>→</span>
                            </button>
                          ) : (
                            <button
                              disabled
                              className="rounded-full border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-5 py-2 text-sm font-semibold text-[#f5ede0]/45"
                            >
                              No editable
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default MyReservations