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
  { id: 1, title: "Novedades manga",      subtitle: "Los últimos tomos recién llegados.",     cta: "Ver catálogo", to: "/catalogo?tag=novedades"   },
  { id: 2, title: "Café de especialidad", subtitle: "Descubre blends y métodos.",             cta: "Descubre",     to: "/sobre"                     },
  { id: 3, title: "Club de lectura",      subtitle: "Eventos, retos y comunidad.",            cta: "Inscribirme",  to: "/club"                      },
  { id: 4, title: "Recomendaciones",      subtitle: "Selección por géneros y gustos.",        cta: "Explorar",     to: "/catalogo?tag=recomendados" },
  { id: 5, title: "Ofertas de la semana", subtitle: "Packs café + cómic.",                    cta: "Ver ofertas",  to: "/catalogo?tag=ofertas"      },
]

const SLIDE_STYLES = [
  { tag: "Manga",   bg: "bg-[#3b1f0e]", border: "border-[#5c3317]" },
  { tag: "Café",    bg: "bg-[#1e2b1a]", border: "border-[#2d4225]" },
  { tag: "Club",    bg: "bg-[#1a1e2b]", border: "border-[#252d42]" },
  { tag: "Picks",   bg: "bg-[#2b1a1e]", border: "border-[#42252d]" },
  { tag: "Ofertas", bg: "bg-[#2b2510]", border: "border-[#42381a]" },
]

const INFO_CARDS = [
  {
    icon: "☕",
    title: "Descubre nuestra especialidad de cafés",
    desc:  "Métodos, blends y recomendaciones para que encuentres tu sabor ideal.",
    cta:   "Descubre",
    to:    "/sobre",
  },
  {
    icon: "📖",
    title: "Apúntate a nuestro club de lectores",
    desc:  "Eventos, retos mensuales y comunidad: lee más y mejor acompañado.",
    cta:   "Inscribirme",
    to:    "/club",
  },
  {
    icon: "🗓",
    title: "Reserva tu mesa",
    desc:  "Asegura tu rincón favorito para leer y tomar algo con calma.",
    cta:   "Ir a reservas",
    to:    "/reservas",
  },
  {
    icon: "🗂",
    title: "Explora el catálogo",
    desc:  "Filtra por género, busca novedades y guarda tus favoritos.",
    cta:   "Explorar",
    to:    "/catalogo",
  },
]

export default function Home() {
  const trackRef = useRef<HTMLDivElement | null>(null)

  function scrollByCards(direction: "left" | "right") {
    const track = trackRef.current
    if (!track) return
    const amount = Math.round(track.clientWidth * 0.8)
    track.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <main className="min-h-screen bg-[#120c07]">
      <div className="mx-auto max-w-6xl px-4 py-10 pb-16">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden rounded-3xl border border-[#5c3317]/40 bg-gradient-to-br from-[#3b1f0e] via-[#1f0f06] to-[#0e0a06] p-8 shadow-2xl md:p-14">
          {/* Glow overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_75%_20%,rgba(200,146,42,0.15),transparent_65%)]" />
          {/* Corner ornaments */}
          <div className="pointer-events-none absolute top-5 right-5 h-20 w-20 rounded-tr-lg border-t border-r border-[#c8922a]/25" />
          <div className="pointer-events-none absolute bottom-5 left-5 h-16 w-16 rounded-bl-lg border-b border-l border-[#c8922a]/20" />

          <div className="relative z-10">
            <span className="mb-5 inline-block rounded-full border border-[#c8922a]/40 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#e5b56a]">
              ✦ Koma Coffee &amp; Comics
            </span>

            <h1 className="font-serif text-4xl font-black leading-tight tracking-tight text-[#f5ede0] md:text-5xl lg:text-6xl">
              Café, cómics y<br />
              <em className="font-serif italic text-[#e5b56a]">mucha buena historia.</em>
            </h1>

            <p className="mt-4 max-w-xl font-serif text-lg italic leading-relaxed text-[#f5ede0]/60">
              Descubre mangas, cómics y novedades. Guarda favoritos,
              gestiona reservas y vive la experiencia Koma Coffee.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c8922a] to-[#a0671c] px-6 py-3 text-sm font-bold text-[#120c07] shadow-lg shadow-[#c8922a]/30 transition hover:-translate-y-0.5 hover:from-[#e5b56a] hover:to-[#c8922a]"
              >
                Ver catálogo <span aria-hidden>→</span>
              </Link>
              <Link
                to="/catalogo?destacados=1"
                className="inline-flex items-center gap-2 rounded-full border border-[#f5ede0]/20 bg-[#f5ede0]/5 px-6 py-3 text-sm font-medium text-[#f5ede0] transition hover:bg-[#f5ede0]/10 hover:border-[#f5ede0]/35"
              >
                Ver destacados
              </Link>
            </div>
          </div>
        </section>

        {/* ── CARRUSEL ── */}
        <section className="mt-12">
          <div className="mb-1 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.67rem] font-medium uppercase tracking-[0.22em] text-[#c8922a]">
                Descubre
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#f5ede0] md:text-3xl">
                Novedades &amp; secciones
              </h2>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => scrollByCards("left")}
                className="rounded-full border border-[#c8922a]/25 bg-[#c8922a]/5 px-3.5 py-2 text-[#e5b56a] transition hover:bg-[#c8922a]/20 hover:border-[#c8922a]/50 hover:text-[#f5ede0]"
                aria-label="Anterior"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollByCards("right")}
                className="rounded-full border border-[#c8922a]/25 bg-[#c8922a]/5 px-3.5 py-2 text-[#e5b56a] transition hover:bg-[#c8922a]/20 hover:border-[#c8922a]/50 hover:text-[#f5ede0]"
                aria-label="Siguiente"
              >
                →
              </button>
            </div>
          </div>

          {/* Ornament divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#c8922a]/50" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
          </div>

          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {SLIDES.map((s, i) => {
              const style = SLIDE_STYLES[i % SLIDE_STYLES.length]
              return (
                <div
                  key={s.id}
                  className={`snap-start shrink-0 w-[268px] md:w-[350px] min-h-[190px] rounded-2xl border ${style.bg} ${style.border} p-5 flex flex-col justify-between transition hover:-translate-y-1 hover:border-[#c8922a]/40`}
                >
                  <div>
                    <p className="mb-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#e5b56a]/70">
                      {style.tag}
                    </p>
                    <h3 className="font-serif text-lg font-bold leading-snug text-[#f5ede0]">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 font-serif text-sm italic leading-relaxed text-[#f5ede0]/50">
                      {s.subtitle}
                    </p>
                  </div>
                  <Link
                    to={s.to}
                    className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#c8922a]/35 bg-[#c8922a]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#e5b56a] transition hover:bg-[#c8922a]/25 hover:border-[#c8922a] hover:text-[#f5ede0]"
                  >
                    {s.cta} <span aria-hidden>→</span>
                  </Link>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── TARJETAS INFO LOCAL ── */}
        <section className="mt-14">
          <div className="mb-1">
            <p className="text-[0.67rem] font-medium uppercase tracking-[0.22em] text-[#c8922a]">
              Vive Koma
            </p>
            <h2 className="font-serif text-2xl font-bold text-[#f5ede0] md:text-3xl">
              Todo lo que ofrece el local
            </h2>
          </div>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#c8922a]/50" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {INFO_CARDS.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="group relative overflow-hidden rounded-2xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/55 to-[#1a120a]/70 p-6 transition hover:-translate-y-0.5 hover:border-[#c8922a]/30 hover:shadow-xl hover:shadow-black/40"
              >
                {/* Top shimmer on hover */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8922a]/40 to-transparent opacity-0 transition group-hover:opacity-100" />

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#c8922a]/20 bg-[#c8922a]/10 text-lg">
                  {card.icon}
                </div>

                <h3 className="font-serif text-lg font-bold leading-snug text-[#f5ede0]">
                  {card.title}
                </h3>
                <p className="mt-2 font-serif text-sm italic leading-relaxed text-[#f5ede0]/50">
                  {card.desc}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#c8922a] transition-[gap] group-hover:gap-2.5">
                  {card.cta} <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}