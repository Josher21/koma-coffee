import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../store/auth-context"
import { reservationService } from "../api/services/reservationService"
import type { Book } from "../types/library"

type Props = {
  book: Book
  onDone?: () => void // para refrescar datos (catálogo o detalle)
  className?: string
}

export default function ReserveButton({ book, onDone, className }: Props) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const available = book.available_copies ?? book.quantity ?? 0
  const hasActiveReservation = !!book.my_active_reservation_id
  const canReserve = available > 0 && !hasActiveReservation

  async function handleReserve(e?: React.MouseEvent) {
    // Si está dentro de una card clicable, evitamos que el click propague
    e?.stopPropagation()

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } })
      return
    }

    setLoading(true)
    setError(null)

    try {
      await reservationService.create(book.id)
      onDone?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reservar")
    } finally {
      setLoading(false)
    }
  }

  if (hasActiveReservation) {
    return (
      <div className={className}>
        <button
          disabled
          className="w-full px-3 py-2 rounded-lg border border-[var(--line)] text-[var(--muted)] bg-white"
        >
          Ya reservado
        </button>
      </div>
    )
  }

  if (!canReserve) {
    return (
      <div className={className}>
        <button
          disabled
          className="w-full px-3 py-2 rounded-lg border border-[var(--line)] text-[var(--muted)] bg-white"
        >
          Sin stock
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      <button
        onClick={handleReserve}
        disabled={loading}
        className="w-full px-3 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] disabled:opacity-60"
      >
        {loading ? "Reservando…" : "Reservar"}
      </button>

      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  )
}
