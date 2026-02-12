import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../store/auth-context"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as { from?: string } | null
  const redirectTo = state?.from ?? "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error en login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
          <h1 className="text-2xl font-extrabold text-white">Iniciar sesión</h1>
          <p className="text-white/70 mt-1">Accede para comprar, guardar favoritos y reservar.</p>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/50
                         focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/50
                         focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />

            <button
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl bg-[var(--accent)] text-white font-semibold
                         hover:bg-[var(--accent-2)] disabled:opacity-60 transition"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>

          {/* ✅ Link de registro dentro del login */}
          <p className="mt-4 text-sm text-white/70">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-white font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}