import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import type { Book } from "../types/library"
import { api } from "../api/apiClient"
import { useAuth } from "../store/auth-context"
import { reservationService } from "../api/services/reservationService"

function BookDetail() {
  const { id } = useParams()
  const bookId = Number(id)

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function loadBook() {
    if (!bookId) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<Book>(`/books/${bookId}`, { auth: isAuthenticated })
      setBook(data)
    } catch {
      setError("No se pudo cargar el libro")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBook() }, [bookId, isAuthenticated])

  async function handleReserve() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } })
      return
    }
    setActionLoading(true)
    setError(null)
    try {
      await reservationService.create(bookId)
      await loadBook()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al reservar")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCancel() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } })
      return
    }
    const reservationId = book?.my_active_reservation_id
    if (!reservationId) return
    setActionLoading(true)
    setError(null)
    try {
      await reservationService.cancel(reservationId)
      await loadBook()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cancelar la reserva")
    } finally {
      setActionLoading(false)
    }
  }

  // ── Estados de carga / error / vacío ──
  if (loading) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-[#120c07] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#f5ede0]/40">
          <span className="h-5 w-5 rounded-full border-2 border-[#c8922a]/30 border-t-[#c8922a] animate-spin" />
          <span className="font-serif italic text-sm">Cargando libro…</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-[#120c07] flex items-center justify-center">
        <div className="rounded-2xl border border-red-900/40 bg-red-950/30 px-8 py-6 text-center">
          <p className="font-serif italic text-red-400/80">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-full border border-[#5c3317]/50 px-5 py-2 text-sm text-[#f5ede0]/50 transition hover:text-[#e5b56a] hover:border-[#c8922a]/40"
          >
            ← Volver
          </button>
        </div>
      </main>
    )
  }

  if (!book) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-[#120c07] flex items-center justify-center">
        <p className="font-serif italic text-[#f5ede0]/30">Libro no encontrado</p>
      </main>
    )
  }

  const available = book.available_copies ?? book.quantity ?? 0
  const hasActiveReservation = !!book.my_active_reservation_id

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#120c07]">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* ── Breadcrumb ── */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#f5ede0]/30">
          <button
            onClick={() => navigate("/catalogo")}
            className="hover:text-[#e5b56a] transition"
          >
            Catálogo
          </button>
          <span>/</span>
          <span className="text-[#f5ede0]/50 line-clamp-1">{book.title}</span>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_1.1fr]">

          {/* ── Imagen ── */}
          <div className="relative rounded-2xl overflow-hidden border border-[#5c3317]/35 bg-[#1a0f06] aspect-[3/4] md:aspect-auto md:min-h-[480px]">
            {book.image ? (
              <img
                src={book.image}
                alt={book.title}
                className="absolute inset-0 h-full w-full object-cover opacity-95"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="text-5xl opacity-15">📖</span>
                <span className="font-serif italic text-sm text-[#f5ede0]/20">Sin imagen</span>
              </div>
            )}
            {/* Gradient overlay bottom */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#120c07]/80 to-transparent" />

            {/* Badge categoría sobre imagen */}
            {book.category?.name && (
              <div className="absolute top-4 left-4">
                <span className="rounded-full border border-[#c8922a]/35 bg-[#120c07]/75 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-[#e5b56a] backdrop-blur-sm">
                  {book.category.name}
                </span>
              </div>
            )}
          </div>

          {/* ── Detalles ── */}
          <div className="flex flex-col gap-6">

            {/* Título y autor */}
            <div>
              <p className="text-[0.67rem] font-medium uppercase tracking-[0.22em] text-[#c8922a]">
                {book.category?.name ?? "Libro"}
              </p>
              <h1 className="mt-1 font-serif text-3xl font-black leading-tight text-[#f5ede0] md:text-4xl">
                {book.title}
              </h1>
              <p className="mt-2 font-serif italic text-lg text-[#f5ede0]/55">
                {book.author}
              </p>
            </div>

            {/* Metadata pills */}
            <div className="flex flex-wrap gap-2">
              {book.editorial && (
                <span className="rounded-full border border-[#5c3317]/45 bg-[#3b1f0e]/30 px-3 py-1 text-xs text-[#f5ede0]/50">
                  {book.editorial}
                </span>
              )}
              {book.pages && (
                <span className="rounded-full border border-[#5c3317]/45 bg-[#3b1f0e]/30 px-3 py-1 text-xs text-[#f5ede0]/50">
                  {book.pages} páginas
                </span>
              )}
              <span className={[
                "rounded-full border px-3 py-1 text-xs font-semibold",
                available > 0
                  ? "border-[#c8922a]/35 bg-[#c8922a]/10 text-[#e5b56a]"
                  : "border-red-900/40 bg-red-950/20 text-red-400/70"
              ].join(" ")}>
                {available > 0 ? `${available} disponible${available !== 1 ? "s" : ""}` : "Agotado"}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[#c8922a]/20 via-[#c8922a]/10 to-transparent" />

            {/* ── Sinopsis ── */}
            {book.synopsis && (
              <div>
                <p className="mb-2 text-[0.67rem] font-medium uppercase tracking-[0.2em] text-[#c8922a]">
                  Sinopsis
                </p>
                <p className="font-serif text-[0.95rem] leading-relaxed text-[#f5ede0]/65">
                  {book.synopsis}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[#c8922a]/20 via-[#c8922a]/10 to-transparent" />

            {/* ── CTA ── */}
            <div className="space-y-3">

              {/* 1) Reserva activa → cancelar */}
              {isAuthenticated && hasActiveReservation && (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={actionLoading}
                    className="w-full rounded-full border border-[#c8922a]/40 bg-transparent px-5 py-3 text-sm font-semibold text-[#e5b56a] transition hover:bg-[#c8922a]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-[#e5b56a]/30 border-t-[#e5b56a] animate-spin" />
                        Cancelando…
                      </span>
                    ) : "Cancelar reserva"}
                  </button>
                  <p className="text-center text-xs text-[#f5ede0]/25 font-serif italic">
                    Reserva activa #{book.my_active_reservation_id}
                  </p>
                </>
              )}

              {/* 2) No autenticado → login */}
              {!isAuthenticated && !hasActiveReservation && (
                <button
                  onClick={() => navigate("/login", { state: { from: location.pathname } })}
                  className="w-full rounded-full bg-gradient-to-r from-[#c8922a] to-[#a0671c] px-5 py-3 text-sm font-bold text-[#120c07] shadow-lg shadow-[#c8922a]/25 transition hover:from-[#e5b56a] hover:to-[#c8922a] hover:-translate-y-0.5"
                >
                  Inicia sesión para reservar
                </button>
              )}

              {/* 3) Autenticado, sin reserva, sin stock → agotado */}
              {isAuthenticated && !hasActiveReservation && available === 0 && (
                <button
                  disabled
                  className="w-full rounded-full border border-red-900/40 bg-red-950/20 px-5 py-3 text-sm font-medium text-red-400/60 cursor-not-allowed"
                >
                  Agotado
                </button>
              )}

              {/* 4) Autenticado, sin reserva, con stock → reservar */}
              {isAuthenticated && !hasActiveReservation && available > 0 && (
                <button
                  onClick={handleReserve}
                  disabled={actionLoading}
                  className="w-full rounded-full bg-gradient-to-r from-[#c8922a] to-[#a0671c] px-5 py-3 text-sm font-bold text-[#120c07] shadow-lg shadow-[#c8922a]/25 transition hover:from-[#e5b56a] hover:to-[#c8922a] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {actionLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-[#120c07]/30 border-t-[#120c07] animate-spin" />
                      Reservando…
                    </span>
                  ) : "Reservar"}
                </button>
              )}

              {error && (
                <p className="text-center text-xs text-red-400/80 font-medium">{error}</p>
              )}
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}

export default BookDetail