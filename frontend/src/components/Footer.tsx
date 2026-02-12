import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="w-full border-t border-[#5c3317]/35 bg-[#1a0f06] mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12">

        {/* ── Marca superior ── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#c8922a] to-[#a0671c] text-[#120c07] grid place-items-center font-black text-sm shadow-lg shadow-[#c8922a]/20">
            K
          </div>
          <div className="leading-tight">
            <p className="font-serif font-bold text-sm text-[#f5ede0] leading-none">Koma Coffee</p>
            <p className="text-[0.65rem] text-[#c8922a]/65 tracking-wide mt-0.5">Café + cultura cómic · Benidorm</p>
          </div>
        </div>

        {/* Ornament divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-[#c8922a]/20 to-transparent" />
          <div className="h-1 w-1 rounded-full bg-[#c8922a]/40" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c8922a]/20" />
        </div>

        {/* ── Contenido principal ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Contacto */}
          <div>
            <p className="text-[0.67rem] font-medium uppercase tracking-[0.2em] text-[#c8922a] mb-3">
              Contacto
            </p>
            <ul className="space-y-1.5 text-sm text-[#f5ede0]/45 font-serif italic">
              <li>Koma Coffee</li>
              <li>Calle Principal 123</li>
              <li>03501 Benidorm, Alicante</li>
              <li>
                <a href="mailto:contacto@komacoffee.es" className="hover:text-[#e5b56a] transition">
                  contacto@komacoffee.es
                </a>
              </li>
              <li>
                <a href="tel:+34600000000" className="hover:text-[#e5b56a] transition">
                  +34 600 000 000
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:text-right">
            <p className="text-[0.67rem] font-medium uppercase tracking-[0.2em] text-[#c8922a] mb-3">
              Información legal
            </p>
            <ul className="space-y-1.5 text-sm">
              {[
                "Condiciones legales",
                "Pago seguro",
                "Política de Cookies",
                "Política de devoluciones",
                "Política de Privacidad",
              ].map((label) => (
                <li key={label}>
                  <Link
                    to="#"
                    className="text-[#f5ede0]/40 hover:text-[#e5b56a] transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Línea inferior ── */}
        <div className="mt-10 pt-6 border-t border-[#5c3317]/25 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#f5ede0]/30">
          <span>© {new Date().getFullYear()} Koma Coffee. Todos los derechos reservados.</span>
          <span className="font-serif italic text-[#c8922a]/40">Café, cómics y buena historia.</span>
        </div>

      </div>
    </footer>
  )
}

export default Footer