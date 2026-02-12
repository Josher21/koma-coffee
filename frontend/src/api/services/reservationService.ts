import { api } from "../apiClient"
import type { Reservation } from "../../types/library"

export const reservationService = {
  create: (bookId: number) =>
    api.post("/reservations", { book_id: bookId }, { auth: true }),

  cancel: (reservationId: number) =>
    api.patch(`/reservations/${reservationId}/cancel`, {}, { auth: true }),

  me: () =>
    api.get<Reservation[]>("/reservations/me", { auth: true }),
};