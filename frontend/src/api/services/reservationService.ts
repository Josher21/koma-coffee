import { api } from "../apiClient"
import type { Reservation } from "../../types/library"

// params adicionales del admin list
type AdminListParams = { 
  page?: number; 
  onlyActive?: boolean } // Solo reservas activas

// tipos extendidios del panel admin sobre los users
export type AdminReservation = Reservation & {
  user?: {
    id: number
    name: string
    email: string
  } | null
}

// Tipo genérico para respuestas paginadas
export type Paginated<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

// Agrupa todas las llamadas relacionadas con el dominio "reservas".
export const reservationService = {

  // Crear una reserva (usuario)
  // POST /reservations
  // Requiere autenticación
  create: (bookId: number) =>
    api.post<{ message: string }>("/reservations", { book_id: bookId }, { auth: true }), // añade Bearer automáticamente (Token Laravel)

  // PATCH /reservations/:id/cancel
  cancel: (reservationId: number) =>
    api.patch<{ message: string }>(`/reservations/${reservationId}/cancel`, {}, { auth: true }),

  // GET /reservations/me
  me: () =>
    api.get<Reservation[]>("/reservations/me", { auth: true }),

  // Admin paginado (devuelve directamente el JSON, no res.data)
  adminList: (params: AdminListParams) => {

    const qs = new URLSearchParams()    // Construimos query string dinámicamente

    if (params.page) qs.set("page", String(params.page))
    if (params.onlyActive) qs.set("onlyActive", "1")

    return api.get<Paginated<AdminReservation>>(`/admin/reservas?${qs.toString()}`, { auth: true }) // Rol ADMIN en back
  },

  // Admin cancela otras reservas
  adminCancel: (reservationId: number) =>
    api.post<{ message: string }>(`/admin/reservas/${reservationId}/cancel`, {}, { auth: true }),
}