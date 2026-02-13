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
  // Estado global de autenticación.
  // Se usa para decidir si se envía token al backend.
  const { isAuthenticated } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])            // Lista de categorías disponibles (para filtro)
  const [pageData, setPageData] = useState<Paginated<Book> | null>(null)  // Datos paginados de libros (incluye metadata)

  // Estados de UX
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // filtros
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<number | "">("")

  // paginación
  const [page, setPage] = useState(1)

  const books = pageData?.data ?? []  // Extraemos libros de la respuesta paginada
  // Restriccion de botones de primera y ulimta pagina
  const canPrev = (pageData?.current_page ?? 1) > 1   
  const canNext = (pageData?.current_page ?? 1) < (pageData?.last_page ?? 1)

  // Cargar categorías desde backend
  // GET /categories
  // Endpoint público
  async function loadCategories() {
    try {
      const res = await api.get<Category[]>("/categories", { auth: false })
      setCategories(res)
    } catch {
      setCategories([]) // Array vacio
    }
  }

  // Construir query string dinámicamente
  // Ej. page=2&search=naruto&category_id=3
  function buildQuery() {
    const params = new URLSearchParams()

    params.set("page", String(page))                          // Página actual
    if (search.trim()) params.set("search", search.trim())      // Solo añadimos search si no está vacío
    if (categoryId !== "") params.set("category_id", String(categoryId))  // Solo añadimos categoría si está seleccionada

    return params.toString()
  }

  // Cargar libros desde backend
  // GET /books?page=X&search=...&category_id=...
  async function loadBooks() {
    setLoading(true)
    setError(null)
    try {
      const qs = buildQuery()

      // Si está autenticado, se envía token.
      // Esto permite que Laravel devuelva campos personalizados
      // como "my_active_reservation_id".
      const res = await api.get<Paginated<Book>>(`/books?${qs}`, { auth: isAuthenticated })   
      setPageData(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el catálogo")
      setPageData(null)
    } finally {
      setLoading(false)
    }
  }
  // Cargar categorías una sola vez al montar el componente
  useEffect(() => { loadCategories() }, [])
  // Si cambian filtros, volvemos a la página 1
  useEffect(() => { setPage(1) }, [search, categoryId])
  // recargamos libros automáticamente tras cambios
  useEffect(() => { loadBooks() }, [page, isAuthenticated, search, categoryId])

  function clearFilters() {
    setSearch("")
    setCategoryId("")
    setPage(1)
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#120c07]">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* ── Page header ── */}
        <div className="mb-8">
          <p className="text-[0.67rem] font-medium uppercase tracking-[0.22em] text-[#c8922a]">
            Koma Coffee
          </p>
          <h1 className="font-serif text-3xl font-black text-[#f5ede0] md:text-4xl">
            Catálogo
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-[#c8922a]/25 to-transparent" />
            <div className="h-1 w-1 rounded-full bg-[#c8922a]/40" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px_1fr]">

          {/* ── Aside filtros ── */}
          <aside className="h-fit rounded-2xl border border-[#5c3317]/40 bg-gradient-to-b from-[#3b1f0e]/50 to-[#1a0f06]/70 p-5">

            <p className="text-[0.67rem] font-medium uppercase tracking-[0.2em] text-[#c8922a]">
              Filtros
            </p>
            <p className="mt-0.5 font-serif text-base font-bold text-[#f5ede0]">Buscar y filtrar</p>

            <div className="mt-5 space-y-5">
              {/* Búsqueda */}
              <div>
                <label className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-[#c8922a]/70 mb-1.5">
                  Título o autor
                </label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ej: Naruto, Urasawa…"
                  className="w-full rounded-full border border-[#5c3317]/50 bg-[#f5ede0]/5 px-4 py-2 text-sm text-[#f5ede0] placeholder:text-[#f5ede0]/25 outline-none focus:border-[#c8922a]/60 focus:bg-[#f5ede0]/8 transition"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-[#c8922a]/70 mb-1.5">
                  Categoría
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-full border border-[#5c3317]/50 bg-[#1a0f06] px-4 py-2 text-sm text-[#f5ede0] outline-none focus:border-[#c8922a]/60 transition appearance-none cursor-pointer"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Limpiar */}
              <button
                onClick={clearFilters}
                className="w-full rounded-full border border-[#5c3317]/40 bg-transparent px-4 py-2 text-sm font-medium text-[#f5ede0]/40 transition hover:border-[#c8922a]/40 hover:text-[#e5b56a]"
              >
                Limpiar filtros
              </button>
            </div>
          </aside>

          {/* ── Sección principal ── */}
          <section>
            {/* Cabecera resultados */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                {pageData && (
                  <span className="rounded-full border border-[#c8922a]/30 bg-[#c8922a]/10 px-3 py-1 text-xs font-semibold text-[#e5b56a]">
                    {pageData.total} {pageData.total === 1 ? "título" : "títulos"}
                  </span>
                )}
              </div>

              {/* Indicador de página activa */}
              {pageData && pageData.last_page > 1 && (
                <span className="text-xs text-[#f5ede0]/35">
                  Pág. <span className="text-[#f5ede0]/60 font-semibold">{pageData.current_page}</span>
                  {" / "}
                  <span className="text-[#f5ede0]/60 font-semibold">{pageData.last_page}</span>
                </span>
              )}
            </div>

            {/* Estado: cargando */}
            {loading && (
              <div className="flex items-center gap-3 py-16 justify-center text-[#f5ede0]/40">
                <span className="h-4 w-4 rounded-full border-2 border-[#c8922a]/30 border-t-[#c8922a] animate-spin" />
                <span className="text-sm font-serif italic">Cargando catálogo…</span>
              </div>
            )}

            {/* Estado: error */}
            {error && (
              <div className="mt-4 rounded-2xl border border-red-900/40 bg-red-950/30 p-5 text-sm text-red-400/80 font-serif italic">
                {error}
              </div>
            )}

            {/* Estado: sin resultados */}
            {!loading && !error && books.length === 0 && (
              <div className="mt-4 rounded-2xl border border-[#5c3317]/30 bg-gradient-to-br from-[#3b1f0e]/30 to-[#1a0f06]/50 p-10 text-center">
                <p className="font-serif text-lg italic text-[#f5ede0]/35">
                  No hay títulos con esos filtros.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-full border border-[#c8922a]/30 bg-[#c8922a]/10 px-5 py-2 text-sm font-semibold text-[#e5b56a] transition hover:bg-[#c8922a]/20"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Grid de libros */}
            {!loading && !error && books.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {books.map((b) => (
                  <BookCard key={b.id} book={b} onReserved={loadBooks} />
                ))}
              </div>
            )}

            {/* ── Paginación ── */}
            {pageData && pageData.last_page > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                {canPrev && (
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-full border border-[#5c3317]/50 bg-[#3b1f0e]/30 px-5 py-2 text-sm font-medium text-[#f5ede0]/60 transition hover:border-[#c8922a]/40 hover:text-[#e5b56a] hover:bg-[#3b1f0e]/50"
                  >
                    ← Anterior
                  </button>
                )}

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: pageData.last_page }, (_, i) => i + 1)
                    .filter((n) => {
                      const cur = pageData.current_page
                      return n === 1 || n === pageData.last_page || Math.abs(n - cur) <= 1
                    })
                    .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                      if (idx > 0 && typeof arr[idx - 1] === "number" && (n as number) - (arr[idx - 1] as number) > 1) {
                        acc.push("…")
                      }
                      acc.push(n)
                      return acc
                    }, [])
                    .map((n, idx) =>
                      n === "…" ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-[#f5ede0]/25 text-sm">
                          …
                        </span>
                      ) : (
                        <button
                          key={n}
                          onClick={() => setPage(n as number)}
                          className={[
                            "h-8 w-8 rounded-full text-sm font-semibold transition",
                            n === pageData.current_page
                              ? "bg-gradient-to-br from-[#c8922a] to-[#a0671c] text-[#120c07] shadow-md shadow-[#c8922a]/25"
                              : "border border-[#5c3317]/40 text-[#f5ede0]/40 hover:border-[#c8922a]/40 hover:text-[#e5b56a]",
                          ].join(" ")}
                        >
                          {n}
                        </button>
                      )
                    )}
                </div>

                {canNext && (
                  <button
                    onClick={() => setPage((p) => Math.min(pageData.last_page, p + 1))}
                    className="rounded-full border border-[#5c3317]/50 bg-[#3b1f0e]/30 px-5 py-2 text-sm font-medium text-[#f5ede0]/60 transition hover:border-[#c8922a]/40 hover:text-[#e5b56a] hover:bg-[#3b1f0e]/50"
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