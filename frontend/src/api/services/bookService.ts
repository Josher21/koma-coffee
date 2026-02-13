import { api } from "../apiClient"
import type { Book, Paginated } from "../../types/library"

// Tipo que define los filtros que puede recibir el listado de libros
export type BookQuery = {
  page?: number
  search?: string
  category_id?: number
}

// Tipo que define qué campos se pueden actualizar en un libro
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

// Obtener listado de libros (con filtros y paginación)
export async function getBooks(q: BookQuery): Promise<Paginated<Book>> {
  // Creamos un objeto para construir parámetros tipo:
  // ?page=1&search=dolor&category_id=3
  const params = new URLSearchParams()

  if (q.page) params.set("page", String(q.page))
  if (q.search) params.set("search", q.search)
  if (q.category_id) params.set("category_id", String(q.category_id))

  const qs = params.toString()
  const url = `/books${qs ? `?${qs}` : ""}` // URL final

  return api.get<Paginated<Book>>(url, { auth: false })
}

// detalles
export function getBookById(id: number): Promise<Book> {
  return api.get<Book>(`/books/${id}`, { auth: false })
}

// update (solo admin)
export function updateBook(id: number, payload: BookUpdatePayload): Promise<Book> {
  return api.put<Book>(`/books/${id}`, payload, { auth: true })
}
