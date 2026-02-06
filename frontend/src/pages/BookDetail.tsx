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
  const [error, setError] = useState<string | null>(null)

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!bookId) return

    setLoading(true)
    setError(null)

    // GET público
    api
      .get<Book>(`/books/${bookId}`, { auth: false })
      .then(setBook)
      .catch(() => setError("No se pudo cargar el libro"))
      .finally(() => setLoading(false))
  }, [bookId])

  async function handleReserve() {
    // Si no estás logueado, te mando a login y guardo a dónde volver
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } })
      return
    }

    try {
      await reservationService.create(bookId)

      // “flash” simple: mandamos un mensaje en state al Home
      navigate("/", {
        replace: true,
        state: {
          flash: "Libro reservado. Te notificaremos lo antes posible.",
        },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al reservar")
    }
  }

  if (loading) return <p className="p-6">Cargando…</p>
  if (error) return <p className="p-6 text-red-700">{error}</p>
  if (!book) return <p className="p-6">Libro no encontrado</p>

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
              Stock: <span className="font-semibold text-[var(--ink)]">{book.quantity}</span>
              {book.category?.name ? ` · ${book.category.name}` : ""}
            </p>

            {book.synopsis && (
              <p className="mt-5 text-sm text-[var(--ink)] leading-relaxed">{book.synopsis}</p>
            )}

            <button
              onClick={handleReserve}
              className="mt-6 w-full px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-2)]"
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default BookDetail