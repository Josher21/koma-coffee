import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../store/auth-context"
import type { Role } from "../types/auth"

type LocationState = {
  from?: { pathname: string }
}

function Login() {
  const { loginMockAs } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as LocationState | null
  const redirectTo = state?.from?.pathname ?? "/"

  function handleLogin(role: Role) {
    loginMockAs(role)
    navigate(redirectTo, { replace: true })
  }

  return (
    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Login</h1>
        <p className="mt-2 text-[var(--muted)]">
          Provisional: simulamos login para probar rutas protegidas y roles.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleLogin("USER")}
            className="px-4 py-2 rounded-lg border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--surface)]"
          >
            Entrar como USER (mock)
          </button>

          <button
            onClick={() => handleLogin("ADMIN")}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-2)]"
          >
            Entrar como ADMIN (mock)
          </button>
        </div>

        <p className="mt-6 text-sm text-[var(--muted)]">
          Después del login, te redirigimos a:{" "}
          <span className="font-semibold text-[var(--ink)]">{redirectTo}</span>
        </p>
      </div>
    </main>
  )
}

export default Login
