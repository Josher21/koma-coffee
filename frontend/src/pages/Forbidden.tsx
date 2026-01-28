import { Link } from "react-router-dom"
import { useAuth } from "../store/auth-context"

function Forbidden() {
  const { isAuthenticated, role } = useAuth()

  return (
    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <section className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-8">
          <p className="text-sm text-[var(--muted)]">Error 403</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Acceso denegado
          </h1>

          <p className="mt-4 text-[var(--muted)] leading-relaxed max-w-2xl">
            No tienes permisos para acceder a esta sección.
            {isAuthenticated ? (
              <>
                {" "}
                Tu rol actual es{" "}
                <span className="font-semibold text-[var(--coffee)]">{role}</span>.
              </>
            ) : (
              <> Inicia sesión para continuar.</>
            )}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] text-center"
            >
              Volver al inicio
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--bg)] text-center"
              >
                Ir a login
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Forbidden