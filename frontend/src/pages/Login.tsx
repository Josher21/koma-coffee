import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../store/auth-context"

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  type LocationState = { from?: string }
  const state = location.state as LocationState | null
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
      navigate(redirectTo, { replace: true }) // Evita que al darle a 'atrás' vuelvas al login
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error en login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Login</h1>
        <p className="mt-2 text-[var(--muted)]">
          Login real contra Laravel (Sanctum token). Te redirigimos a:{" "}
          <span className="font-semibold text-[var(--ink)]">{redirectTo}</span>
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-6"
        >
          <label className="block text-sm font-semibold text-[var(--ink)]">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white p-2"
              placeholder="jose@koma.local"
              required
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-[var(--ink)]">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white p-2"
              placeholder="••••••"
              required
            />
          </label>

          {error && (
            <p className="mt-4 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Login