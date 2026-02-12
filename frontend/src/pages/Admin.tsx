import { useEffect, useMemo, useState } from "react"
import { reservationService } from "../api/services/reservationService"

type AdminReservation = {
  id: number
  status: "active" | "cancelled" | string
  reserved_at?: string | null
  book?: {
    id: number
    title: string
    image?: string | null
  } | null
  user?: {
    id: number
    name: string
    email: string
  } | null
}

type Paginated<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export default function Admin() {
  const [page, setPage] = useState(1)
  const [onlyActive, setOnlyActive] = useState(false)

  const [rows, setRows] = useState<AdminReservation[]>([])
  const [meta, setMeta] = useState<Paginated<AdminReservation>["meta"] | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      // ✅ Admin list paginado
      const res: Paginated<AdminReservation> = await reservationService.adminList({
        page,
        onlyActive,
      })
      setRows(res.data)
      setMeta(res.meta)
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las reservas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [page, onlyActive])

  async function handleCancel(reservationId: number) {
    if (!confirm("¿Cancelar esta reserva?")) return
    setActionLoadingId(reservationId)
    setError(null)
    try {
      await reservationService.adminCancel(reservationId)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cancelar la reserva")
    } finally {
      setActionLoadingId(null)
    }
  }

  function openGmailCompose(email: string, bookTitle?: string) {
    const subject = encodeURIComponent("Reserva en Koma Coffee")
    const body = encodeURIComponent(
      `Hola,\n\nTe escribo sobre tu reserva${bookTitle ? ` del libro "${bookTitle}"` : ""}.\n\nUn saludo,\nKoma Coffee`
    )
    // ✅ Abre Gmail “redactar”
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}&su=${subject}&body=${body}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const canPrev = useMemo(() => (meta ? meta.current_page > 1 : false), [meta])
  const canNext = useMemo(() => (meta ? meta.current_page < meta.last_page : false), [meta])

  return (
    <main className="min-h-screen bg-[#120c07]">
      <div className="mx-auto max-w-6xl px-4 py-10 pb-16">
        {/* Header */}
        <div className="mb-2">
          <p className="text-[0.67rem] font-medium uppercase tracking-[0.22em] text-[#c8922a]">
            Administración
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-serif text-2xl font-bold text-[#f5ede0] md:text-3xl">
              Panel Admin
            </h1>

            <div className="text-xs font-medium uppercase tracking-[0.14em] text-[#f5ede0]/50">
              Total{" "}
              <span className="text-[#e5b56a]">
                {meta?.total ?? rows.length}
              </span>
            </div>
          </div>
          <p className="mt-2 font-serif text-sm italic text-[#f5ede0]/60">
            Ruta protegida por rol <span className="text-[#e5b56a]">ADMIN</span>. Aquí puedes ver y gestionar todas las reservas.
          </p>
        </div>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#c8922a]/50" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Filtros + paginación */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setPage(1)
                setOnlyActive(false)
              }}
              className="rounded-full border border-[#c8922a]/25 bg-[#c8922a]/5 px-4 py-2 text-sm font-semibold text-[#e5b56a]
                         transition hover:bg-[#c8922a]/20 hover:border-[#c8922a]/50 hover:text-[#f5ede0]"
            >
              Todas
            </button>

            <button
              type="button"
              onClick={() => {
                setPage(1)
                setOnlyActive(true)
              }}
              className={[
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                onlyActive
                  ? "border-[#c8922a] bg-[#c8922a]/25 text-[#f5ede0]"
                  : "border-[#c8922a]/25 bg-[#c8922a]/5 text-[#e5b56a] hover:bg-[#c8922a]/20 hover:border-[#c8922a]/50 hover:text-[#f5ede0]",
              ].join(" ")}
            >
              Solo activas
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canPrev || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-[#c8922a]/25 bg-[#c8922a]/5 px-3.5 py-2 text-[#e5b56a]
                         transition hover:bg-[#c8922a]/20 hover:border-[#c8922a]/50 hover:text-[#f5ede0] disabled:opacity-50"
            >
              ←
            </button>

            <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#f5ede0]/50">
              Página{" "}
              <span className="text-[#e5b56a]">{meta?.current_page ?? page}</span>
              {meta?.last_page ? (
                <>
                  {" "}
                  / <span className="text-[#f5ede0]/70">{meta.last_page}</span>
                </>
              ) : null}
            </span>

            <button
              type="button"
              disabled={!canNext || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-[#c8922a]/25 bg-[#c8922a]/5 px-3.5 py-2 text-[#e5b56a]
                         transition hover:bg-[#c8922a]/20 hover:border-[#c8922a]/50 hover:text-[#f5ede0] disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/35 to-[#1a120a]/60 p-6 text-[#f5ede0]/70">
            Cargando…
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/35 to-[#1a120a]/60 p-6 text-[#f5ede0]/60">
            No hay reservas para este filtro.
          </div>
        ) : (
          <div className="grid gap-4">
            {rows.map((r) => {
              const isActive = r.status === "active"
              const bookTitle = r.book?.title ?? "Libro"
              // ⚠️ Si tu backend devuelve "usuario" en vez de "user", cambia aquí:
              const userName = r.user?.name ?? "Usuario"
              const userEmail = r.user?.email ?? ""

              return (
                <div
                  key={r.id}
                  className="group relative overflow-hidden rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/45 to-[#1a120a]/65 p-5
                             transition hover:-translate-y-0.5 hover:border-[#c8922a]/30 hover:shadow-xl hover:shadow-black/40"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8922a]/40 to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Izquierda: libro + usuario */}
                    <div className="flex items-start gap-4">
                      <div className="h-20 w-14 shrink-0 overflow-hidden rounded-xl border border-[#c8922a]/15 bg-[#f5ede0]/5">
                        {r.book?.image ? (
                          <img src={r.book.image} alt={bookTitle} className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-[0.7rem] text-[#f5ede0]/40">
                            Sin imagen
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#e5b56a]/70">
                          Reserva #{r.id}
                        </p>

                        <p className="font-serif text-lg font-bold leading-snug text-[#f5ede0]">
                          {bookTitle}
                        </p>

                        <p className="mt-1 font-serif text-sm italic text-[#f5ede0]/55">
                          Usuario:{" "}
                          <span className="not-italic font-semibold text-[#f5ede0]">
                            {userName}
                          </span>{" "}
                          {userEmail ? (
                            <span className="text-[#f5ede0]/45">({userEmail})</span>
                          ) : null}
                        </p>

                        <p className="mt-1 font-serif text-sm italic text-[#f5ede0]/55">
                          {r.reserved_at ? `Fecha: ${new Date(r.reserved_at).toLocaleString()}` : ""}
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

                    {/* Derecha: acciones */}
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={!userEmail}
                        onClick={() => userEmail && openGmailCompose(userEmail, bookTitle)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#c8922a]/35 bg-[#c8922a]/10 px-5 py-2 text-sm font-semibold text-[#e5b56a]
                                   transition hover:bg-[#c8922a]/25 hover:border-[#c8922a] hover:text-[#f5ede0] disabled:opacity-50"
                      >
                        Enviar mensaje <span aria-hidden>→</span>
                      </button>

                      {isActive ? (
                        <button
                          type="button"
                          onClick={() => handleCancel(r.id)}
                          disabled={actionLoadingId === r.id}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-200
                                     transition hover:bg-red-500/20 hover:border-red-500/40 disabled:opacity-60"
                        >
                          {actionLoadingId === r.id ? "Cancelando…" : "Cancelar"}
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
      </div>
    </main>
  )
}