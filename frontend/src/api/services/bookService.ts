import { api } from "../apiClient"
import type { Book, Paginated } from "../../types/library"

export type BookQuery = {
  page?: number
  search?: string
  category_id?: number
}

export type BookUpdatePayload = {
  title: string
  author: string
  editorial: string | null
  pages: number | null
  synopsis: string | null
  image: string | null
  quantity: number
  category_id: number
}

export async function getBooks(q: BookQuery): Promise<Paginated<Book>> {
  const params = new URLSearchParams()

  if (q.page) params.set("page", String(q.page))
  if (q.search) params.set("search", q.search)
  if (q.category_id) params.set("category_id", String(q.category_id))

  const qs = params.toString()
  const url = `/books${qs ? `?${qs}` : ""}`

  return api.get<Paginated<Book>>(url, { auth: false })
}

// ✅ NUEVO: detalle
export function getBookById(id: number): Promise<Book> {
  return api.get<Book>(`/books/${id}`, { auth: false })
}

// ✅ NUEVO: update (solo admin)
export function updateBook(id: number, payload: BookUpdatePayload): Promise<Book> {
  return api.put<Book>(`/books/${id}`, payload, { auth: true })
}
