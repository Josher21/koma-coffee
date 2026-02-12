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
      // auth opcional: con sesión añade my_active_reservation_id
      const data = await api.get<Book>(`/books/${bookId}`, { auth: isAuthenticated })
      setBook(data)
    } catch {
      setError("No se pudo cargar el libro")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBook()
  }, [bookId, isAuthenticated])

  async function handleReserve() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } })
      return
    }

    setActionLoading(true)
    setError(null)

    try {
      await reservationService.create(bookId)
      await loadBook() // refresca botones/stock
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
      setError(e instanceof Error ? e.message : "Error al cancelar")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <p className="p-6">Cargando…</p>
  if (error) return <p className="p-6 text-red-700">{error}</p>
  if (!book) return <p className="p-6">Libro no encontrado</p>

  // Compat: si aún no viene available_copies, cae a quantity
  const available = book.available_copies ?? book.quantity
  const hasActiveReservation = !!book.my_active_reservation_id

  const canReserve = available > 0 && !hasActiveReservation

  return (
    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Imagen izquierda */}
          <div className="rounded-2xl overflow-hidden border border-[var(--line)] bg-white">
            {book.image ? (
              <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="h-72 grid place-items-center text-[var(--muted)]">Sin imagen</div>
            )}
          </div>

          {/* Detalles derecha */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <h1 className="text-2xl font-semibold text-[var(--ink)]">{book.title}</h1>

            <p className="mt-2 text-[var(--muted)]">
              <span className="font-semibold text-[var(--ink)]">{book.author}</span>
              {book.editorial ? ` · ${book.editorial}` : ""}
              {book.pages ? ` · ${book.pages} págs` : ""}
            </p>

            <p className="mt-3 text-sm text-[var(--muted)]">
              Stock disponible: <span className="font-semibold text-[var(--ink)]">{available}</span>
              {book.category?.name ? ` · ${book.category.name}` : ""}
            </p>

            {book.synopsis && (
              <p className="mt-5 text-sm text-[var(--ink)] leading-relaxed">{book.synopsis}</p>
            )}

            {/* Botones */}
            {!isAuthenticated && (
              <button
                onClick={() => navigate("/login", { state: { from: location.pathname } })}
                className="mt-6 w-full px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-2)]"
              >
                Inicia sesión para reservar
              </button>
            )}

            {isAuthenticated && canReserve && (
              <button
                onClick={handleReserve}
                disabled={actionLoading}
                className="mt-6 w-full px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] disabled:opacity-60"
              >
                {actionLoading ? "Reservando…" : "Reservar"}
              </button>
            )}

            {isAuthenticated && hasActiveReservation && (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="mt-6 w-full px-4 py-2 rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-white disabled:opacity-60"
              >
                {actionLoading ? "Cancelando…" : "Cancelar reserva"}
              </button>
            )}

            {isAuthenticated && !hasActiveReservation && available === 0 && (
              <div className="mt-6 w-full px-4 py-2 rounded-lg bg-white border border-[var(--line)] text-[var(--muted)] text-center">
                Sin copias disponibles
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default BookDetail