import { useRef } from "react"
import { Link } from "react-router-dom"

type Slide = {
  id: number
  title: string
  subtitle: string
  cta: string
  to: string
}

const SLIDES: Slide[] = [
  { id: 1, title: "Novedades manga", subtitle: "Los últimos tomos recién llegados.", cta: "Ver catálogo", to: "/catalogo?tag=novedades" },
  { id: 2, title: "Café de especialidad", subtitle: "Descubre blends y métodos.", cta: "Descubre", to: "/sobre" },
  { id: 3, title: "Club de lectura", subtitle: "Eventos, retos y comunidad.", cta: "Inscribirme", to: "/club" },
  { id: 4, title: "Recomendaciones", subtitle: "Selección por géneros y gustos.", cta: "Explorar", to: "/catalogo?tag=recomendados" },
  { id: 5, title: "Ofertas de la semana", subtitle: "Packs café + cómic.", cta: "Ver ofertas", to: "/catalogo?tag=ofertas" },
]

export default function Home() {
  const trackRef = useRef<HTMLDivElement | null>(null)

  function scrollByCards(direction: "left" | "right") {
    const track = trackRef.current
    if (!track) return

    // Desplaza aprox 1 tarjeta y pico (se siente “carrusel”)
    const amount = Math.round(track.clientWidth * 0.8)
    track.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]">
          <div
            className="absolute inset-0 pointer-events-none opacity-40
                       bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.35),transparent_50%),
                           radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.25),transparent_45%),
                           radial-gradient(circle_at_50%_90%,rgba(34,197,94,0.12),transparent_45%)]"
          />
          <div className="relative">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Café y cómics, en un solo sitio.
            </h1>
            <p className="mt-3 text-white/75 max-w-2xl">
              Descubre mangas, cómics y novedades. Guarda favoritos, gestiona reservas y disfruta la experiencia Koma Coffee.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="px-5 py-3 rounded-full bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-2)] transition shadow-sm"
              >
                Ver catálogo
              </Link>
              <Link
                to="/catalogo?destacados=1"
                className="px-5 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/15 transition"
              >
                Ver destacados
              </Link>
            </div>
          </div>
        </section>

        {/* CARRUSEL */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4 mb-4">
            <h2 className="text-white text-xl md:text-2xl font-extrabold">Novedades</h2>

            {/* Botones del carrusel */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCards("left")}
                className="px-3 py-2 rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition"
                aria-label="Anterior"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollByCards("right")}
                className="px-3 py-2 rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition"
                aria-label="Siguiente"
              >
                →
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 overflow-hidden">
            {/* Scroll horizontal con “snap” (sensación carrusel) */}
            <div
              ref={trackRef}
              className="flex gap-4 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory
                         [scrollbar-width:none] [-ms-overflow-style:none]"
            >
              {/* Oculta scrollbar en Chrome */}
              <style>{`
                div::-webkit-scrollbar { display: none; }
              `}</style>

              {SLIDES.map((s) => (
                <div
                  key={s.id}
                  className="snap-start min-w-[260px] md:min-w-[360px] h-[180px] rounded-3xl border border-white/10 bg-white/5
                             p-5 flex flex-col justify-between hover:bg-white/10 transition"
                >
                  <div>
                    <h3 className="text-white font-extrabold text-lg">{s.title}</h3>
                    <p className="mt-1 text-white/70 text-sm">{s.subtitle}</p>
                  </div>

                  <Link
                    to={s.to}
                    className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)] text-white font-semibold
                               hover:bg-[var(--accent-2)] transition"
                  >
                    {s.cta} <span aria-hidden>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TARJETAS INFO LOCAL */}
        <section className="mt-10">
          <h2 className="text-white text-xl md:text-2xl font-extrabold mb-4">Vive Koma Coffee</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <h3 className="text-white font-extrabold text-lg">Descubre nuestra especialidad de cafés</h3>
              <p className="mt-2 text-white/70">
                Métodos, blends y recomendaciones para que encuentres tu sabor ideal.
              </p>
              <Link
                to="/sobre"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-semibold hover:bg-white/15 transition"
              >
                Descubre <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <h3 className="text-white font-extrabold text-lg">Apúntate a nuestro club de lectores</h3>
              <p className="mt-2 text-white/70">
                Eventos, retos mensuales y comunidad: lee más y mejor acompañado.
              </p>
              <Link
                to="/club"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-semibold hover:bg-white/15 transition"
              >
                Inscribirme <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <h3 className="text-white font-extrabold text-lg">Reserva tu mesa (si aplica)</h3>
              <p className="mt-2 text-white/70">
                Si tu backend ya gestiona reservas, aquí conectamos el flujo completo.
              </p>
              <Link
                to="/reservas"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-semibold hover:bg-white/15 transition"
              >
                Ir a reservas <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Card 4 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <h3 className="text-white font-extrabold text-lg">Explora el catálogo</h3>
              <p className="mt-2 text-white/70">
                Filtra por género, busca novedades y guarda tus favoritos.
              </p>
              <Link
                to="/catalogo"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-semibold hover:bg-white/15 transition"
              >
                Explorar <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}