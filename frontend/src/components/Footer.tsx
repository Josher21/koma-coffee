import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="w-full border-t border-[var(--line)] bg-[var(--surface)] mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* IZQUIERDA — Contacto */}
          <div>
            <h3 className="text-[var(--ink)] font-semibold mb-4">
              Contacto
            </h3>

            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>Koma Coffee</li>
              <li>Calle Principal 123</li>
              <li>03501 Benidorm, Alicante</li>
              <li>Email: contacto@komacoffee.es</li>
              <li>Tel: +34 600 000 000</li>
            </ul>
          </div>

          {/* DERECHA — Enlaces legales */}
          <div className="md:text-right">
            <h3 className="text-[var(--ink)] font-semibold mb-4">
              Información legal
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-[var(--muted)] hover:text-[var(--ink)] transition">
                  Condiciones legales
                </Link>
              </li>
              <li>
                <Link to="#" className="text-[var(--muted)] hover:text-[var(--ink)] transition">
                  Pago seguro
                </Link>
              </li>
              <li>
                <Link to="#" className="text-[var(--muted)] hover:text-[var(--ink)] transition">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="#" className="text-[var(--muted)] hover:text-[var(--ink)] transition">
                  Política de devoluciones
                </Link>
              </li>
              <li>
                <Link to="#" className="text-[var(--muted)] hover:text-[var(--ink)] transition">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-10 pt-6 border-t border-[var(--line)] text-center text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} Koma Coffee. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  )
}

export default Footer