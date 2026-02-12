export type Category = {
  id: number
  name: string
}

export type Book = {
  id: number
  title: string
  author: string
  editorial: string | null
  pages: number | null
  synopsis: string | null
  image: string | null

  quantity: number

  // Back de reservas
  total_copies?: number
  available_copies?: number
  my_active_reservation_id?: number | null
  is_reserved_by_me?: boolean

  category_id: number
  category?: Category
}

// Laravel paginate() devuelve algo con esta estructura
export type Paginated<T> = {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
