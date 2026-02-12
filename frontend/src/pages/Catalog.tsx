import { useEffect, useState } from "react"
import type { Book, Category } from "../types/library"
import { api } from "../api/apiClient"
import { useAuth } from "../store/auth-context"
import BookCard from "../components/BookCard"

type Paginated<T> = {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export default function Catalogo() {
  const { isAuthenticated } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [pageData, setPageData] = useState<Paginated<Book> | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // filtros
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<number | "">("")

  // paginación
  const [page, setPage] = useState(1)

  const books = pageData?.data ?? []
  const canPrev = (pageData?.current_page ?? 1) > 1
  const canNext = (pageData?.current_page ?? 1) < (pageData?.last_page ?? 1)

  async function loadCategories() {
    try {
      const res = await api.get<Category[]>("/categories", { auth: false })
      setCategories(res)
    } catch {
      setCategories([])
    }
  }

  function buildQuery() {
    const params = new URLSearchParams()
    params.set("page", String(page))

    if (search.trim()) params.set("search", search.trim())
    if (categoryId !== "") params.set("category_id", String(categoryId))

    return params.toString()
  }

  async function loadBooks() {
    setLoading(true)
    setError(null)

    try {
      const qs = buildQuery()
      const res = await api.get<Paginated<Book>>(`/books?${qs}`, { auth: isAuthenticated })
      setPageData(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el catálogo")
      setPageData(null)
    } finally {
      setLoading(false)
    }
  }

  // cargar categorías una vez
  useEffect(() => {
    loadCategories()
  }, [])

  // cuando cambian filtros, volver a página 1
  useEffect(() => {
    setPage(1)
  }, [search, categoryId])

  // cargar libros cuando cambia page/filtros/login
  useEffect(() => {
    loadBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isAuthenticated, search, categoryId])

  function clearFilters() {
    setSearch("")
    setCategoryId("")
    setPage(1)
  }

  return (
    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          {/* Filtros */}
          <aside className="rounded-2xl border border-[var(--line)] bg-white p-5 h-fit">
            <h2 className="text-sm font-semibold text-[var(--ink)]">Filtros</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-[var(--muted)]">Buscar (título o autor)</label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ej: Naruto, Urasawa..."
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--line)] bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--muted)]">Categoría</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--line)] bg-white"
                >
                  <option value="">Todas</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 rounded-lg border border-[var(--line)] text-sm text-[var(--muted)] hover:bg-[var(--surface)]"
              >
                Limpiar filtros
              </button>
            </div>
          </aside>

          {/* Contenido */}
          <section>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-[var(--ink)]">Catálogo</h1>

              {pageData && (
                <div className="text-sm text-[var(--muted)]">
                  Total: <span className="font-semibold text-[var(--ink)]">{pageData.total}</span>
                </div>
              )}
            </div>

            {loading && <p className="mt-6">Cargando…</p>}
            {error && <p className="mt-6 text-red-700">{error}</p>}

            {!loading && !error && books.length === 0 && (
              <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-6 text-[var(--muted)]">
                No hay libros con esos filtros.
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((b) => (
                <BookCard key={b.id} book={b} onReserved={loadBooks} />
              ))}
            </div>

            {/* Paginación: ocultar flechas en primera/última */}
            {pageData && pageData.last_page > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                {canPrev && (
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-lg border border-[var(--line)] bg-white"
                  >
                    ← Anterior
                  </button>
                )}

                <span className="text-sm text-[var(--muted)]">
                  Página <span className="font-semibold text-[var(--ink)]">{pageData.current_page}</span> de{" "}
                  <span className="font-semibold text-[var(--ink)]">{pageData.last_page}</span>
                </span>

                {canNext && (
                  <button
                    onClick={() => setPage((p) => Math.min(pageData.last_page, p + 1))}
                    className="px-4 py-2 rounded-lg border border-[var(--line)] bg-white"
                  >
                    Siguiente →
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}