import { useNavigate } from "react-router-dom"
import type { Book } from "../types/library"
import ReserveButton from "./ReserveButton"

type Props = {
    book: Book
    onReserved?: () => void // para refrescar catálogo
}

export default function BookCard({ book, onReserved }: Props) {
    const navigate = useNavigate()
    const available = book.available_copies ?? book.quantity ?? 0
    const hasStock = available > 0
    const hasReservation = !!book.my_active_reservation_id

    return (
        <article
        onClick={() => navigate(`/catalogo/${book.id}`)}
        className="cursor-pointer rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden hover:shadow-sm transition"
        >
        <div className="h-44 bg-white border-b border-[var(--line)]">
            {book.image ? (
            <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
            ) : (
            <div className="h-full grid place-items-center text-[var(--muted)] text-sm">Sin imagen</div>
            )}
        </div>

        <div className="p-4">
            <h3 className="text-[var(--ink)] font-semibold line-clamp-2">{book.title}</h3>
            <p className="mt-1 text-sm text-[var(--muted)] line-clamp-1">{book.author}</p>

            <p className="mt-2 text-xs text-[var(--muted)]">
            Stock: <span className="font-semibold text-[var(--ink)]">{book.available_copies ?? book.quantity ?? 0}</span>
            </p>

            {/* Botón reservar dentro de la card */}
            <div className="mt-3">
            {hasReservation ? (
                <button
                disabled
                className="w-full px-3 py-2 rounded-lg border border-[var(--line)] text-[var(--muted)] bg-white"
                >
                Ya reservado
                </button>
            ) : !hasStock ? (
                <button
                disabled
                className="w-full px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700"
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