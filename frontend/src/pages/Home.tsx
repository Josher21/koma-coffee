/** Prueba paraa comprobar la llamada al backend */
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { healthService } from "../api/services"
import type { HealthResponse } from "../api/services/healthService"


type Feature = {
  title: string
  desc: string
  tag: string
}

const features: Feature[] = [
  { title: "Café de especialidad", desc: "Selección cuidada y métodos de filtrado.", tag: "Calidad" },
  { title: "Ambiente cómic", desc: "Un espacio moderno con guiños sutiles.", tag: "Cultura" },
  { title: "Para llevar", desc: "Pide rápido y recoge sin esperas.", tag: "Rápido" },
]

function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [flash, setFlash] = useState<string | null>(null)

  useEffect(() => {
    const msg = (location.state as any)?.flash
    if (msg) {
      setFlash(msg)

      // Limpia el state para que el mensaje no reaparezca
      navigate(".", { replace: true, state: null })
    }
  }, [location.state, navigate])

  useEffect(() => {
    healthService
      .getHealth()
      .then(setHealth)
      .catch((e: unknown) => {
        setHealthError(e instanceof Error ? e.message : "Error desconocido")
      })
  }, [])

  return (
  

    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      
      {flash && (
        <div className="mb-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-[var(--ink)]">
          ✅ {flash}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Hero */}
        <section className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-8 md:p-10">
          <p className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            Koma Coffee · Benidorm
          </p>

          <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight text-[var(--ink)]">
            Café moderno con alma de cómic.
          </h1>

          <p className="mt-4 max-w-2xl text-[var(--muted)] leading-relaxed">
            Un home provisional pero ya con estructura real: hero, secciones, tarjetas y estilos coherentes.
            Más adelante conectaremos con Laravel (token + roles) y añadiremos funcionalidades.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-2)]">
              Ver carta (provisional)
            </button>
            <button className="px-4 py-2 rounded-lg border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--bg)]">
              Conocer la marca
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-6"
            >
              <p className="text-xs font-semibold text-[var(--coffee)]">{f.tag}</p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--ink)]">{f.title}</h3>
              <p className="mt-2 text-[var(--muted)]">{f.desc}</p>
            </article>
          ))}
        </section>

        {/* Sección “destacados” (mock visual) */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--ink)]">Destacados</h2>
              <p className="mt-1 text-[var(--muted)]">Luego esto vendrá del backend (CRUD Productos).</p>
            </div>
            <button className="hidden sm:block px-3 py-2 rounded-lg border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--surface)]">
              Ver todo
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Flat White", "Cold Brew", "Matcha Latte"].map((name) => (
              <div
                key={name}
                className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] overflow-hidden"
              >
                <div className="h-36 bg-[var(--ink)]/5" />
                <div className="p-5">
                  <h3 className="font-semibold text-[var(--ink)]">{name}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Descripción provisional. Más adelante: precio, categoría, stock, etc.
                  </p>
                  <button className="mt-4 px-3 py-2 rounded-lg bg-[var(--ink)] text-white hover:opacity-90">
                    Añadir (mock)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-6 text-sm text-[var(--muted)]">
        {health && <p>API: OK ✅ ({health.app ?? "laravel"})</p>}
        {healthError && <p>API: ERROR ❌ ({healthError})</p>}
        {!health && !healthError && <p>API: comprobando…</p>}
      </div>

    </main>
  )
}

export default Home
