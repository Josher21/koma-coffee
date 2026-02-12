import { api } from "../apiClient"
import type { LaravelPaginated, Reservation } from "../../types/library"

export const reservationService = {
  create: (bookId: number) =>
    api.post("/reservations", { book_id: bookId }, { auth: true }),

  cancel: (reservationId: number) =>
    api.patch(`/reservations/${reservationId}/cancel`, {}, { auth: true }),

  me: (page = 1) =>
    api.get<LaravelPaginated<Reservation>>(`/reservations/me?page=${page}`, { auth: true }),
};