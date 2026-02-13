import { useNavigate } from "react-router-dom"
import type { Book } from "../types/library"
import ReserveButton from "./ReserveButton"

// Definimos las propiedades (props) que recibe el componente BookCard
type Props = {
  book: Book              // Objeto libro con toda su información
  onReserved?: () => void // Propiedad posterior al reservar
}

// Componente que representa una tarjeta individual de libro
export default function BookCard({ book, onReserved }: Props) {
  const navigate = useNavigate()                                // Hook de React Router que permite cambiar de página desde código.
  const available = book.available_copies ?? book.quantity ?? 0 // Calculamos cuántas copias están disponibles.
  const hasStock = available > 0
  // Booleano que indica si el usuario actual tiene una reserva activa de este libro.
  // "!!" convierte el valor en true/false.
  const hasReservation = !!book.my_active_reservation_id

  return (
    <article
      onClick={() => navigate(`/catalogo/${book.id}`)}
      className="group cursor-pointer rounded-2xl border border-[#5c3317]/35 bg-gradient-to-b from-[#3b1f0e]/40 to-[#1a0f06]/60 overflow-hidden transition hover:-translate-y-1 hover:border-[#c8922a]/35 hover:shadow-xl hover:shadow-black/40"
    >
      {/* ── Imagen ── */}
      <div className="relative h-48 bg-[#1a0f06] border-b border-[#5c3317]/30 overflow-hidden">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <span className="text-3xl opacity-20">📖</span>
            <span className="text-xs text-[#f5ede0]/20 font-serif italic">Sin imagen</span>
          </div>
        )}

        {/* Badge stock sobre la imagen */}
        <div className="absolute top-3 right-3">
          {hasReservation ? (
            <span className="rounded-full border border-[#c8922a]/40 bg-[#120c07]/80 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wide text-[#e5b56a] backdrop-blur-sm">
              ✓ Reservado
            </span>
          ) : !hasStock ? (
            <span className="rounded-full border border-red-900/50 bg-[#120c07]/80 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wide text-red-400/80 backdrop-blur-sm">
              Agotado
            </span>
          ) : (
            <span className="rounded-full border border-[#5c3317]/50 bg-[#120c07]/80 px-2.5 py-1 text-[0.62rem] font-semibold text-[#f5ede0]/40 backdrop-blur-sm">
              {available} disp.
            </span>
          )}
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-4">
        {/* Shimmer superior al hover */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8922a]/30 to-transparent opacity-0 transition group-hover:opacity-100" />

        <h3 className="font-serif font-bold text-[#f5ede0] leading-snug line-clamp-2">
          {book.title}
        </h3>
        <p className="mt-1 text-sm font-serif italic text-[#f5ede0]/45 line-clamp-1">
          {book.author}
        </p>

        {/* Divider */}
        <div className="my-3 h-px bg-gradient-to-r from-[#c8922a]/15 via-[#c8922a]/25 to-transparent" />

        {/* Botón reservar */}
        <div onClick={(e) => e.stopPropagation()}>
          {hasReservation ? (
            <button
              disabled
              className="w-full rounded-full border border-[#5c3317]/40 bg-[#3b1f0e]/30 px-4 py-2 text-sm font-medium text-[#f5ede0]/30 cursor-not-allowed"
            >
              ✓ Ya reservado
            </button>
          ) : !hasStock ? (
            <button
              disabled
              className="w-full rounded-full border border-red-900/40 bg-red-950/20 px-4 py-2 text-sm font-medium text-red-400/60 cursor-not-allowed"
            >
              Agotado
            </button>
          ) : (
            <ReserveButton book={book} onDone={onReserved} />
          )}
        </div>
      </div>
    </article>
  )
}