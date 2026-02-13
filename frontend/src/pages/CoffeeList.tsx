import { useMemo, useState } from "react"

type MenuSection = {
  title: string
  desc?: string
  items: { name: string; price?: string; note?: string }[]
}

const SECTIONS: MenuSection[] = [
  {
    title: "Café de especialidad",
    desc: "Espresso, filtro y opciones con leche.",
    items: [
      { name: "Espresso", price: "1,80€" },
      { name: "Americano", price: "2,20€" },
      { name: "Cappuccino", price: "2,60€" },
      { name: "Latte", price: "2,80€" },
      { name: "Flat White", price: "2,90€" },
      { name: "Cold Brew", price: "3,20€", note: "Disponible según temporada" },
    ],
  },
  {
    title: "Tés e infusiones",
    desc: "Clásicos y blends suaves.",
    items: [
      { name: "Té negro", price: "2,20€" },
      { name: "Té verde", price: "2,20€" },
      { name: "Rooibos", price: "2,30€" },
      { name: "Manzanilla", price: "2,00€" },
    ],
  },
  {
    title: "Dulce",
    desc: "Algo para acompañar la lectura.",
    items: [
      { name: "Cookie casera", price: "1,90€" },
      { name: "Brownie", price: "2,40€" },
      { name: "Carrot cake", price: "3,20€" },
    ],
  },
  {
    title: "Salado",
    desc: "Piques rápidos para una tarde larga.",
    items: [
      { name: "Tostada (AOVE / tomate)", price: "2,60€" },
      { name: "Bocadillo mini", price: "3,50€" },
      { name: "Empanada", price: "3,20€" },
    ],
  },
]

export default function CoffeeList() {
  const [open, setOpen] = useState<string | null>(SECTIONS[0]?.title ?? null)
  const [showMenu, setShowMenu] = useState(false)

  //const openIndex = useMemo(() => SECTIONS.findIndex(s => s.title === open), [open])

  return (
    <main className="min-h-screen bg-[#120c07]">
      <div className="mx-auto max-w-6xl px-4 py-10 pb-16">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden rounded-3xl border border-[#5c3317]/40 bg-gradient-to-br from-[#3b1f0e] via-[#1f0f06] to-[#0e0a06] p-8 shadow-2xl md:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_75%_20%,rgba(200,146,42,0.15),transparent_65%)]" />
          <div className="pointer-events-none absolute top-5 right-5 h-20 w-20 rounded-tr-lg border-t border-r border-[#c8922a]/25" />
          <div className="pointer-events-none absolute bottom-5 left-5 h-16 w-16 rounded-bl-lg border-b border-l border-[#c8922a]/20" />

          <div className="relative z-10">
            <span className="mb-5 inline-block rounded-full border border-[#c8922a]/40 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#e5b56a]">
              ✦ Cafetería
            </span>

            <h1 className="font-serif text-4xl font-black leading-tight tracking-tight text-[#f5ede0] md:text-5xl">
              Carta y métodos<br />
              <em className="font-serif italic text-[#e5b56a]">para leer sin prisa.</em>
            </h1>

            <p className="mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-[#f5ede0]/60">
              Consulta nuestra carta y descubre recomendaciones de preparación. Si vienes a estudiar o a leer,
              este es tu sitio.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setShowMenu(true)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c8922a] to-[#a0671c] px-6 py-3 text-sm font-bold text-[#120c07] shadow-lg shadow-[#c8922a]/30 transition hover:-translate-y-0.5 hover:from-[#e5b56a] hover:to-[#c8922a]"
              >
                Ver carta (PNG) <span aria-hidden>→</span>
              </button>

              <button
                onClick={() => setOpen(SECTIONS[0]?.title ?? null)}
                className="inline-flex items-center gap-2 rounded-full border border-[#f5ede0]/20 bg-[#f5ede0]/5 px-6 py-3 text-sm font-medium text-[#f5ede0] transition hover:bg-[#f5ede0]/10 hover:border-[#f5ede0]/35"
              >
                Ver secciones
              </button>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#c8922a]/50" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8922a]/25 to-transparent" />
        </div>

        {/* ── CONTENT GRID ── */}
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          {/* Accordion */}
          <section className="rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/45 to-[#1a120a]/65 p-6">
            <div className="mb-4">
              <p className="text-[0.67rem] font-medium uppercase tracking-[0.22em] text-[#c8922a]">
                Carta rápida
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-[#f5ede0]">
                Secciones
              </h2>
              <p className="mt-2 font-serif text-sm italic text-[#f5ede0]/55">
                Resumen por categorías. La carta completa está en la imagen.
              </p>
            </div>

            <div className="space-y-3">
              {SECTIONS.map((sec, idx) => {
                const isOpen = sec.title === open
                return (
                  <div
                    key={sec.title}
                    className="overflow-hidden rounded-2xl border border-[#c8922a]/12 bg-[#f5ede0]/5"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : sec.title)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-[#f5ede0]/5"
                      aria-expanded={isOpen}
                    >
                      <div>
                        <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#e5b56a]/75">
                          {String(idx + 1).padStart(2, "0")}
                        </p>
                        <h3 className="font-serif text-lg font-bold text-[#f5ede0]">
                          {sec.title}
                        </h3>
                        {sec.desc && (
                          <p className="mt-1 font-serif text-sm italic text-[#f5ede0]/50">
                            {sec.desc}
                          </p>
                        )}
                      </div>

                      <span
                        className={[
                          "shrink-0 rounded-full border px-3 py-2 text-sm font-semibold",
                          isOpen
                            ? "border-[#c8922a]/40 bg-[#c8922a]/15 text-[#f5ede0]"
                            : "border-[#c8922a]/25 bg-[#c8922a]/5 text-[#e5b56a]"
                        ].join(" ")}
                        aria-hidden
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4">
                        <div className="h-px bg-gradient-to-r from-[#c8922a]/20 via-[#c8922a]/10 to-transparent" />
                        <ul className="mt-3 space-y-2">
                          {sec.items.map((it) => (
                            <li
                              key={it.name}
                              className="flex items-start justify-between gap-4 rounded-xl border border-[#c8922a]/10 bg-[#120c07]/35 px-3 py-2"
                            >
                              <div>
                                <p className="font-serif text-sm text-[#f5ede0]">{it.name}</p>
                                {it.note && (
                                  <p className="text-xs text-[#f5ede0]/45">{it.note}</p>
                                )}
                              </div>
                              {it.price && (
                                <span className="text-sm font-semibold text-[#e5b56a]">
                                  {it.price}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="mt-4 text-xs font-serif italic text-[#f5ede0]/35">
              Consejo: si la carta cambia, solo sustituyes <span className="text-[#e5b56a]">menu.png</span>.
            </p>
          </section>

          {/* Right info card */}
          <aside className="rounded-3xl border border-[#c8922a]/12 bg-gradient-to-br from-[#3b1f0e]/45 to-[#1a120a]/65 p-6 h-fit">
            <p className="text-[0.67rem] font-medium uppercase tracking-[0.22em] text-[#c8922a]">
              Recomendaciones
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[#f5ede0]">
              Métodos & tips
            </h2>

            <div className="mt-4 space-y-3">
              <Tip title="Para espresso">
                Si te gusta intenso, prueba un espresso doble o un cappuccino clásico.
              </Tip>
              <Tip title="Para leer tranquilo">
                Filtro o latte: más suave y con más taza.
              </Tip>
              <Tip title="Cold brew">
                Perfecto para tardes largas: menos acidez, más frescura.
              </Tip>
            </div>

            <div className="mt-6 rounded-2xl border border-[#c8922a]/12 bg-[#f5ede0]/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e5b56a]/80">
                Atajo
              </p>
              <p className="mt-2 font-serif text-sm italic text-[#f5ede0]/55">
                ¿Vienes a leer? Reserva tu mesa y ven con calma.
              </p>
              <a
                href="/reservas"
                className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#c8922a]/35 bg-[#c8922a]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#e5b56a] transition hover:bg-[#c8922a]/25 hover:border-[#c8922a] hover:text-[#f5ede0]"
              >
                Ir a reservas <span aria-hidden>→</span>
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* ── MODAL MENU ── */}
      {showMenu && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#c8922a]/20 bg-[#120c07] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#c8922a]/15 bg-[#f5ede0]/5 px-5 py-4">
              <div>
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#e5b56a]/75">
                  Carta completa
                </p>
                <p className="font-serif text-base font-bold text-[#f5ede0]">
                  Koma Coffee — Menú
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/menu.png"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#c8922a]/25 bg-[#c8922a]/5 px-4 py-2 text-sm font-semibold text-[#e5b56a]
                             transition hover:bg-[#c8922a]/20 hover:border-[#c8922a]/50 hover:text-[#f5ede0]"
                >
                  Abrir en pestaña
                </a>
                <button
                  onClick={() => setShowMenu(false)}
                  className="rounded-full border border-[#c8922a]/25 bg-[#c8922a]/5 px-4 py-2 text-sm font-semibold text-[#e5b56a]
                             transition hover:bg-[#c8922a]/20 hover:border-[#c8922a]/50 hover:text-[#f5ede0]"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="max-h-[78vh] overflow-auto p-4">
              <img
                src="/menu.png"
                alt="Carta de Koma Coffee"
                className="w-full rounded-2xl border border-[#c8922a]/15"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Tip({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#c8922a]/12 bg-[#f5ede0]/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e5b56a]/80">
        {title}
      </p>
      <p className="mt-2 font-serif text-sm italic text-[#f5ede0]/55">
        {children}
      </p>
    </div>
  )
}