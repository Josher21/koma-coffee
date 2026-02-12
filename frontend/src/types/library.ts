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

export type Reservation = {
  id: number
  status: "active" | "cancelled" | "returned"
  reserved_at: string | null
  expires_at: string | null
  created_at: string | null
  updated_at: string | null
  book?: Book
}

// Laravel paginate() devuelve algo con esta estructura
export type Paginated<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export type AdminReservation = Reservation & {
  user?: {
    id: number
    name: string
    email: string
  } | null
}

// Estructura real de paginate() con Resources
export type LaravelPaginated<T> = {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    links: Array<{ url: string | null; label: string; active: boolean }>
    path: string
    per_page: number
    to: number | null
    total: number
  }
}