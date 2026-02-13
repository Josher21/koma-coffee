import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../store/auth-context"

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Validación local simple
  function validate() {
    if (name.trim().length < 2) return "El nombre debe tener al menos 2 caracteres."
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Email no válido."
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres."
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }

    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      navigate("/", { replace: true })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error en registro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#120c07] flex items-center">
      <div className="mx-auto w-full max-w-md px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/55 to-[#1a120a]/70 p-6 shadow-2xl shadow-black/40">
          {/* Shimmer top */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8922a]/40 to-transparent opacity-60" />

          <span className="mb-4 inline-block rounded-full border border-[#c8922a]/40 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#e5b56a]">
            ✦ Koma Coffee &amp; Comics
          </span>

          <h1 className="font-serif text-3xl font-black tracking-tight text-[#f5ede0]">
            Registro
          </h1>
          <p className="mt-2 font-serif text-sm italic leading-relaxed text-[#f5ede0]/60">
            Registro real contra Laravel. Al registrarte, iniciarás sesión automáticamente.
          </p>

          {/* Ornament divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#c8922a]/50" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#e5b56a]/80">
              Nombre
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="mt-2 w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0] placeholder:text-[#f5ede0]/40
                           focus:outline-none focus:ring-2 focus:ring-[#c8922a]/25 focus:border-[#c8922a]/35"
                placeholder="Jose Luis"
                required
              />
            </label>

            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#e5b56a]/80">
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-2 w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0] placeholder:text-[#f5ede0]/40
                           focus:outline-none focus:ring-2 focus:ring-[#c8922a]/25 focus:border-[#c8922a]/35"
                placeholder="jose@koma.local"
                required
              />
            </label>

            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#e5b56a]/80">
              Contraseña
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-2 w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0] placeholder:text-[#f5ede0]/40
                           focus:outline-none focus:ring-2 focus:ring-[#c8922a]/25 focus:border-[#c8922a]/35"
                placeholder="mínimo 6 caracteres"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c8922a] to-[#a0671c] px-6 py-3 text-sm font-bold text-[#120c07]
                         shadow-lg shadow-[#c8922a]/25 transition hover:-translate-y-0.5 hover:from-[#e5b56a] hover:to-[#c8922a] disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? "Registrando…" : "Crear cuenta"} <span aria-hidden>→</span>
            </button>
          </form>

          <p className="mt-5 text-sm text-[#f5ede0]/60">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#e5b56a] hover:text-[#f5ede0] transition"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Register