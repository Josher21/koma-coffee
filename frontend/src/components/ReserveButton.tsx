import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../store/auth-context"
import { reservationService } from "../api/services/reservationService"
import type { Book } from "../types/library"

type Props = {
  book: Book
  onDone?: () => void
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

  // ── Ya reservado ──
  if (hasActiveReservation) {
    return (
      <div className={className}>
        <button
          disabled
          className="w-full rounded-full border border-[#5c3317]/40 bg-[#3b1f0e]/30 px-4 py-2 text-sm font-medium text-[#f5ede0]/35 cursor-not-allowed"
        >
          ✓ Ya reservado
        </button>
      </div>
    )
  }

  // ── Sin stock ──
  if (!canReserve) {
    return (
      <div className={className}>
        <button
          disabled
          className="w-full rounded-full border border-[#5c3317]/30 bg-transparent px-4 py-2 text-sm font-medium text-[#f5ede0]/30 cursor-not-allowed"
        >
          Sin stock
        </button>
      </div>
    )
  }

  // ── Disponible ──
  return (
    <div className={className}>
      <button
        onClick={handleReserve}
        disabled={loading}
        className="w-full rounded-full bg-gradient-to-r from-[#c8922a] to-[#a0671c] px-4 py-2 text-sm font-bold text-[#120c07] shadow-md shadow-[#c8922a]/25 transition hover:from-[#e5b56a] hover:to-[#c8922a] hover:-translate-y-0.5 hover:shadow-[#c8922a]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-[#120c07]/30 border-t-[#120c07] animate-spin" />
            Reservando…
          </span>
        ) : (
          "Reservar"
        )}
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-400/80 text-center font-medium">
          {error}
        </p>
      )}
    </div>
  )
}