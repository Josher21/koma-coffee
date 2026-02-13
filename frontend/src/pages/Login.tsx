import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../store/auth-context"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()    // Hook para navegar programáticamente entre rutas
  const location = useLocation()    // Hook para acceder al estado de la ruta actual

  // Si el usuario fue redirigido aquí desde otra página protegida,
  // guardamos esa ruta en "state.from"
  const state = location.state as { from?: string } | null
  // Volvemos a la ruta guardada y si no a Home
  const redirectTo = state?.from ?? "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)   // Error si falla el login
  const [loading, setLoading] = useState(false)       // Estado de carga mientras se hace la petición al backend

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()  // Evita que el formulario recargue la página
    setError(null)
    setLoading(true)

    try {
      // Llamamos al login del contexto (que llama a la API)
      await login(email, password)
      // Si todo va bien, redirigimos a la página anterior (replace evita que volvamos a la página de login)
      navigate(redirectTo, { replace: true })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error en login")
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
            Iniciar sesión
          </h1>
          <p className="mt-2 font-serif text-sm italic leading-relaxed text-[#f5ede0]/60">
            Accede para comprar, guardar favoritos y reservar.
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
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0] placeholder:text-[#f5ede0]/40
                         focus:outline-none focus:ring-2 focus:ring-[#c8922a]/25 focus:border-[#c8922a]/35"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Contraseña"
              className="w-full rounded-2xl border border-[#f5ede0]/10 bg-[#f5ede0]/5 px-4 py-3 text-[#f5ede0] placeholder:text-[#f5ede0]/40
                         focus:outline-none focus:ring-2 focus:ring-[#c8922a]/25 focus:border-[#c8922a]/35"
              required
            />

            <button
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c8922a] to-[#a0671c] px-6 py-3 text-sm font-bold text-[#120c07]
                         shadow-lg shadow-[#c8922a]/25 transition hover:-translate-y-0.5 hover:from-[#e5b56a] hover:to-[#c8922a] disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? "Entrando…" : "Entrar"} <span aria-hidden>→</span>
            </button>
          </form>

          <p className="mt-5 text-sm text-[#f5ede0]/60">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#e5b56a] hover:text-[#f5ede0] transition"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
