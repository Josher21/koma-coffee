import { Link } from "react-router-dom"

function NotFound() {
  return (
    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <section className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-8">
          <p className="text-sm text-[var(--muted)]">Error 404</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Página no encontrada
          </h1>

          <p className="mt-4 text-[var(--muted)] leading-relaxed max-w-2xl">
            La ruta a la que intentas acceder no existe (o fue movida).
            Revisa la URL o vuelve al inicio.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] text-center"
            >
              Volver al inicio
            </Link>

            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--bg)] text-center"
            >
              Ir a login
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default NotFound
