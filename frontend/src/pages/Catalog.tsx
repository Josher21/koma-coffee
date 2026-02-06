import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { bookService, categoryService } from "../api/services"
import type { Book, Category, Paginated } from "../types/library"

function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()

  // 1) Leemos estado desde la URL
  const search = searchParams.get("search") ?? ""
  const categoryId = searchParams.get("category_id")
    ? Number(searchParams.get("category_id"))
    : 0
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1

  // 2) Estados de datos
  type SortKey = "title" | "author" | "stock"
  type SortDir = "asc" | "desc"

  const [sort, setSort] = useState<SortKey>("title")
  const [dir, setDir] = useState<SortDir>("asc")
  const [categories, setCategories] = useState<Category[]>([])
  const [books, setBooks] = useState<Paginated<Book> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sortedBooks = books
  ? [...books.data].sort((a, b) => {
      let result = 0

      if (sort === "stock") {
        result = a.quantity - b.quantity
      } else {
        const av = (sort === "title" ? a.title : a.author).toLowerCase()
        const bv = (sort === "title" ? b.title : b.author).toLowerCase()
        result = av.localeCompare(bv)
      }

      return dir === "asc" ? result : -result
    })
  : []


  // 3) Cargar categorías una vez (para el select)
  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {})
  }, [])

  // 4) Cargar libros cada vez que cambian filtros/página
  useEffect(() => {
    setLoading(true)
    setError(null)

    bookService
      .getBooks({
        page,
        search: search || undefined,
        category_id: categoryId || undefined,
      })
      .then(setBooks)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Error cargando catálogo")
      )
      .finally(() => setLoading(false))
  }, [page, search, categoryId])

  // helper: actualiza parámetros y resetea page si cambias filtro
  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)

    if (!value) next.delete(key)
    else next.set(key, value)

    // si cambias filtros, vuelve a página 1
    if (key !== "page") next.set("page", "1")

    setSearchParams(next)
  }

  function goToPage(n: number) {
    const next = new URLSearchParams(searchParams)
    next.set("page", String(n))
    setSearchParams(next)
  }

  const canPrev = books ? books.current_page > 1 : false
  const canNext = books ? books.current_page < books.last_page : false

  return (
    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Catálogo</h1>
        <p className="mt-2 text-[var(--muted)]">
          Búsqueda, filtros y paginación leyendo la URL (SPA real).
        </p>

        {/* Filtros */}
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setParam("search", e.target.value)}
            placeholder="Buscar por título o autor…"
            className="w-full rounded-lg border border-[var(--line)] bg-white p-2"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="w-full rounded-lg border border-[var(--line)] bg-white p-2"
            >
            <option value="title">Orden: Título</option>
            <option value="author">Orden: Autor</option>
            <option value="stock">Orden: Stock</option>
          </select>

          <select
            value={dir}
            onChange={(e) => setDir(e.target.value as SortDir)}
            className="w-full rounded-lg border border-[var(--line)] bg-white p-2"
            >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>

          <select
            value={categoryId ? String(categoryId) : ""}
            onChange={(e) => setParam("category_id", e.target.value)}
            className="w-full rounded-lg border border-[var(--line)] bg-white p-2"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        {loading && <p className="mt-6 text-[var(--muted)]">Cargando…</p>}
        {error && <p className="mt-6 text-red-700">{error}</p>}

        {/* Grid */}
        {books && (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedBooks.map((b) => (
                <article
                  key={b.id}
                  className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] overflow-hidden"
                >
                  {/* Card */}
                  <Link to={`/catalogo/${b.id}`} className="block">
                    <div className="aspect-[16/10] bg-white">
                      {b.image ? (
                        <img
                          src={b.image}
                          alt={b.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-[var(--muted)]">
                          Sin imagen
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <h3 className="font-semibold text-[var(--ink)]">{b.title}</h3>
                    <p className="text-sm text-[var(--muted)] mt-1">
                      {b.author} · {b.editorial ?? "Editorial N/D"}
                    </p>
                    <p className="text-sm text-[var(--muted)] mt-2">
                      Stock:{" "}
                      <span className="text-[var(--ink)] font-semibold">
                        {b.quantity}
                      </span>
                      {b.category?.name ? ` · ${b.category.name}` : ""}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginación */}
            <div className="mt-8 flex items-center justify-between">
              <button
                disabled={!canPrev}
                onClick={() => goToPage(page - 1)}
                className="px-4 py-2 rounded-lg border border-[var(--line)] disabled:opacity-50 hover:bg-[var(--surface)]"
              >
                Anterior
              </button>

              <p className="text-sm text-[var(--muted)]">
                Página{" "}
                <span className="font-semibold text-[var(--ink)]">
                  {books.current_page}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-[var(--ink)]">
                  {books.last_page}
                </span>
              </p>

              <button
                disabled={!canNext}
                onClick={() => goToPage(page + 1)}
                className="px-4 py-2 rounded-lg border border-[var(--line)] disabled:opacity-50 hover:bg-[var(--surface)]"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default Catalog