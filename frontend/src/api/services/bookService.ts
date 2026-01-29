import { api } from "../apiClient"
import type { Book, Paginated } from "../../types/library"

export type BookQuery = {
  page?: number
  search?: string
  category_id?: number
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
