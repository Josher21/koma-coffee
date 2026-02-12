import { api } from "../apiClient"
import type { Reservation } from "../../types/library"
type AdminListParams = { page?: number; onlyActive?: boolean }

export const reservationService = {
  create: (bookId: number) =>
    api.post("/reservations", { book_id: bookId }, { auth: true }),

  cancel: (reservationId: number) =>
    api.patch(`/reservations/${reservationId}/cancel`, {}, { auth: true }),

  me: () =>
    api.get<Reservation[]>("/reservations/me", { auth: true }),

  adminList: async (params: AdminListParams) => {
    const qs = new URLSearchParams()
    if (params.page) qs.set("page", String(params.page))
    if (params.onlyActive) qs.set("onlyActive", "1")

    // EJEMPLO: /api/admin/reservas?page=1&onlyActive=1
    return api.get(`/admin/reservas?${qs.toString()}`).then(r => r.data)
  },

  adminCancel: async (reservationId: number) => {
    // EJEMPLO: /api/admin/reservas/:id/cancel
    return api.post(`/admin/reservas/${reservationId}/cancel`).then(r => r.data)
  },
};