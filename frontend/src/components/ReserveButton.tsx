import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../store/auth-context"
import { reservationService } from "../api/services/reservationService"
import type { Book } from "../types/library"

type Props = {
  book: Book            // Libro sobre el que se va a actuar
  onDone?: () => void   // Función opcional a ejecutar tras reservar
  className?: string    // Permite pasar estilos desde fuera (reutilizable)
}

// Componente reutilizable que gestiona la acción de reservar un libro
export default function ReserveButton({ book, onDone, className }: Props) {
  const { isAuthenticated } = useAuth() // Estado global de autenticación
  const navigate = useNavigate()        // Permite redirigir  
  const location = useLocation()        // Permite saber la ruta actual (para volver tras login)

  // Estados internos del botón
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const available = book.available_copies ?? book.quantity ?? 0 // Calculamos copias disponibles
  const hasActiveReservation = !!book.my_active_reservation_id  // ¿El usuario tiene ya una reserva activa?
  const canReserve = available > 0 && !hasActiveReservation     // ¿Se puede reservar? → hay stock y no hay reserva activa

  async function handleReserve(e?: React.MouseEvent) {
    e?.stopPropagation()

    // Si no está autenticado, lo enviamos al login
    // y guardamos la ruta actual para volver después
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } })
      return
    }

    setLoading(true)
    setError(null)

    try {
      await reservationService.create(book.id) // Llamada al backend: POST /reservations
      onDone?.()                               // Si el componente padre pasó una función onDone, a ejecutamos
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