import { api } from "../apiClient"

export const reservationService = {
  create: (bookId: number) =>
    api.post("/reservations", { book_id: bookId }, { auth: true }),
}
