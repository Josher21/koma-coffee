import { api } from "../apiClient"
import type { Reservation } from "../../types/library"

// params del admin list
type AdminListParams = { page?: number; onlyActive?: boolean }

// ✅ añade estos tipos (pueden vivir aquí o en types/library.ts)
export type AdminReservation = Reservation & {
  user?: {
    id: number
    name: string
    email: string
  } | null
}

export type Paginated<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const reservationService = {
  create: (bookId: number) =>
    api.post<{ message: string }>("/reservations", { book_id: bookId }, { auth: true }),

  cancel: (reservationId: number) =>
    api.patch<{ message: string }>(`/reservations/${reservationId}/cancel`, {}, { auth: true }),

  me: () =>
    api.get<Reservation[]>("/reservations/me", { auth: true }),

  // ✅ Admin paginado (devuelve directamente el JSON, no res.data)
  adminList: (params: AdminListParams) => {
    const qs = new URLSearchParams()
    if (params.page) qs.set("page", String(params.page))
    if (params.onlyActive) qs.set("onlyActive", "1")

    return api.get<Paginated<AdminReservation>>(`/admin/reservas?${qs.toString()}`, { auth: true })
  },

  // ✅ Admin cancel
  adminCancel: (reservationId: number) =>
    api.post<{ message: string }>(`/admin/reservas/${reservationId}/cancel`, {}, { auth: true }),
}