import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import type { Book, Category } from "../types/library"
import { useAuth } from "../store/auth-context"
import { getCategories } from "../api/services/categoryService"
import { getBookById, updateBook, type BookUpdatePayload } from "../api/services/bookService"

export default function BookEdit() {
  const { id } = useParams()
  const bookId = Number(id)

  const navigate = useNavigate()
  const location = useLocation()

  const { isAuthenticated, role } = useAuth()
  const isAdmin = role === "ADMIN"

  const backTo = (location.state as { from?: string } | null)?.from ?? `/books/${bookId}`

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [book, setBook] = useState<Book | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const [form, setForm] = useState<BookUpdatePayload>({
    title: "",
    author: "",
    editorial: null,
    pages: null,
    synopsis: null,
    image: null,
    quantity: 0,
    category_id: 1,
  })

  const canSubmit = useMemo(() => {
    if (!form.title.trim()) return false
    if (!form.author.trim()) return false
    if (!Number.isFinite(form.quantity) || form.quantity < 0) return false
    if (!Number.isFinite(form.category_id) || form.category_id <= 0) return false
    if (form.pages != null && form.pages < 0) return false
    return true
  }, [form])

  function setField<K extends keyof BookUpdatePayload>(key: K, value: BookUpdatePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function load() {
    if (!bookId) return
    setLoading(true)
    setError(null)

    try {
      const [b, cats] = await Promise.all([getBookById(bookId), getCategories()])
      setBook(b)
      setCategories(cats)

      // ✅ precarga del formulario con tu Book type
      setForm({
        title: b.title ?? "",
        author: b.author ?? "",
        editorial: b.editorial ?? null,
        pages: b.pages ?? null,
        synopsis: b.synopsis ?? null,
        image: b.image ?? null,
        quantity: b.quantity ?? 0,
        category_id: b.category_id,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el libro")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // ✅ protección extra (aunque la ruta esté protegida)
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } })
      return
    }
    if (!isAdmin) {
      navigate(backTo, { replace: true })
      return
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, isAuthenticated, isAdmin])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!canSubmit) {
      setError("Revisa los campos obligatorios antes de guardar.")
      return
    }

    setSaving(true)
    try {
      const updated = await updateBook(bookId, form)
      setBook(updated)
      navigate(backTo, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar cambios")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#120c07] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#f5ede0]/40">
          <span className="h-5 w-5 rounded-full border-2 border-[#c8922a]/30 border-t-[#c8922a] animate-spin" />
          <span className="font-serif italic text-sm">Cargando edición…</span>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#120c07]">
      <div className="mx-auto max-w-6xl px-4 py-10 pb-16">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.67rem] font-medium uppercase tracking-[0.22em] text-[#c8922a]">
              Administración
            </p>
            <h1 className="font-serif text-2xl font-bold text-[#f5ede0] md:text-3xl">
              Editar libro
            </h1>
            <p className="mt-2 font-serif text-sm italic text-[#f5ede0]/60">
              Cambia los campos y guarda. Volverás al detalle al terminar.
            </p>
          </div>

          <button
            onClick={() => navigate(backTo)}
            className="rounded-full border border-[#c8922a]/25 bg-[#c8922a]/5 px-4 py-2 text-sm font-semibold text-[#e5b56a]
                       transition hover:bg-[#c8922a]/20 hover:border-[#c8922a]/50 hover:text-[#f5ede0]"
          >
            ← Volver
          </button>
        </div>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#c8922a]/50" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          {/* Preview */}
          <div className="rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/45 to-[#1a120a]/65 p-5">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-[#c8922a]/15 bg-[#f5ede0]/5">
              {form.image ? (
                <img src={form.image} alt={form.title} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm text-[#f5ede0]/45">
                  Sin imagen
                </div>
              )}
            </div>

            <p className="mt-4 font-serif text-sm text-[#f5ede0]/60">
              <span className="text-[#e5b56a]">Editando:</span> {book?.title ?? "—"}
            </p>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/45 to-[#1a120a]/65 p-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Field label="Título *">
                <input
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  className="w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0]
                             placeholder:text-[#f5ede0]/40 focus:outline-none focus:ring-2 focus:ring-[#c8922a]/25 focus:border-[#c8922a]/35"
                  required
                />
              </Field>

              <Field label="Autor *">
                <input
                  value={form.author}
                  onChange={(e) => setField("author", e.target.value)}
                  className="w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0]"
                  required
                />
              </Field>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Editorial">
                  <input
                    value={form.editorial ?? ""}
                    onChange={(e) => setField("editorial", e.target.value || null)}
                    className="w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0]"
                  />
                </Field>

                <Field label="Páginas">
                  <input
                    type="number"
                    min={0}
                    value={form.pages ?? ""}
                    onChange={(e) => setField("pages", e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0]"
                  />
                </Field>

                <Field label="Cantidad (stock) *">
                  <input
                    type="number"
                    min={0}
                    value={form.quantity}
                    onChange={(e) => setField("quantity", Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0]"
                    required
                  />
                </Field>

                <Field label="Categoría *">
                  <select
                    value={form.category_id}
                    onChange={(e) => setField("category_id", Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0]"
                    required
                  >
                    {categories.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#120c07]">
                            {c.name}
                        </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Imagen (URL)">
                <input
                  value={form.image ?? ""}
                  onChange={(e) => setField("image", e.target.value || null)}
                  className="w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0]"
                  placeholder="https://..."
                />
              </Field>

              <Field label="Sinopsis">
                <textarea
                  value={form.synopsis ?? ""}
                  onChange={(e) => setField("synopsis", e.target.value || null)}
                  className="min-h-[140px] w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0]
                             focus:outline-none focus:ring-2 focus:ring-[#c8922a]/25 focus:border-[#c8922a]/35"
                />
              </Field>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c8922a] to-[#a0671c] px-6 py-3 text-sm font-bold text-[#120c07]
                             shadow-lg shadow-[#c8922a]/25 transition hover:-translate-y-0.5 hover:from-[#e5b56a] hover:to-[#c8922a]
                             disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {saving ? "Guardando…" : "Guardar cambios"} <span aria-hidden>→</span>
                </button>

                <button
                  type="button"
                  disabled={!book}
                  onClick={() => {
                    if (!book) return
                    setForm({
                      title: book.title,
                      author: book.author,
                      editorial: book.editorial,
                      pages: book.pages,
                      synopsis: book.synopsis,
                      image: book.image,
                      quantity: book.quantity,
                      category_id: book.category_id,
                    })
                  }}
                  className="rounded-full border border-[#c8922a]/25 bg-[#c8922a]/5 px-6 py-3 text-sm font-semibold text-[#e5b56a]
                             transition hover:bg-[#c8922a]/20 hover:border-[#c8922a]/50 hover:text-[#f5ede0] disabled:opacity-60"
                >
                  Rehacer
                </button>
              </div>

              <p className="pt-2 text-xs font-serif italic text-[#f5ede0]/35">
                * Campos obligatorios.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#e5b56a]/80">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  )
}