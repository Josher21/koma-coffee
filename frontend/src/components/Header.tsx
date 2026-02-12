import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../store/auth-context"

function Header() {
  const { isAuthenticated, auth, role, logout } = useAuth()
  const navigate = useNavigate()
  const [q, setQ] = useState("")

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const s = q.trim()
    navigate(s ? `/catalogo?search=${encodeURIComponent(s)}` : "/catalogo")
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "px-3 py-1.5 rounded-full text-sm font-medium transition",
      isActive
        ? "bg-[#c8922a]/20 text-[#e5b56a] border border-[#c8922a]/40"
        : "text-[#f5ede0]/60 hover:text-[#f5ede0] hover:bg-[#f5ede0]/8",
    ].join(" ")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#5c3317]/35 bg-[#1a0f06]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">

        {/* ── Marca ── */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#c8922a] to-[#a0671c] text-[#120c07] grid place-items-center font-black text-base shadow-lg shadow-[#c8922a]/25">
            K
          </div>
          <div className="leading-tight">
            <p className="font-serif font-bold text-sm text-[#f5ede0] leading-none">Koma Coffee</p>
            <p className="text-[0.67rem] text-[#c8922a]/70 tracking-wide mt-0.5">Café + cultura cómic</p>
          </div>
        </div>

        {/* ── Nav links ── */}
        <nav className="hidden sm:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/cafeteria" className={linkClass}>Cafetería</NavLink>
          <NavLink to="/catalogo" className={linkClass}>Catálogo</NavLink>
          {isAuthenticated && (
            <NavLink to="/reservas" className={linkClass}>Mis reservas</NavLink>
          )}
          {isAuthenticated && role === "ADMIN" && (
            <NavLink to="/admin" className={linkClass}>Admin</NavLink>
          )}
        </nav>

        {/* ── Búsqueda + sesión ── */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Buscador */}
          <form onSubmit={onSearch} className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar libros…"
              className="w-44 rounded-full border border-[#5c3317]/50 bg-[#f5ede0]/5 px-4 py-1.5 text-sm text-[#f5ede0] placeholder:text-[#f5ede0]/30 outline-none focus:border-[#c8922a]/60 focus:bg-[#f5ede0]/8 transition"
            />
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-[#c8922a] to-[#a0671c] px-4 py-1.5 text-sm font-semibold text-[#120c07] transition hover:from-[#e5b56a] hover:to-[#c8922a] shadow-sm shadow-[#c8922a]/20"
            >
              Buscar
            </button>
          </form>

          {/* Sesión */}
          {!isAuthenticated ? (
            <button
              onClick={() => navigate("/login")}
              className="rounded-full border border-[#c8922a]/35 bg-[#c8922a]/10 px-4 py-1.5 text-sm font-semibold text-[#e5b56a] transition hover:bg-[#c8922a]/25 hover:border-[#c8922a]/60"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#f5ede0]/55">
                Hola,{" "}
                <span className="text-[#f5ede0] font-semibold">{auth.user?.name}</span>
                <span className="ml-2 inline-block rounded-full border border-[#c8922a]/30 bg-[#c8922a]/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#e5b56a]">
                  {role}
                </span>
              </span>
              <button
                onClick={() => logout()}
                className="rounded-full border border-[#5c3317]/50 bg-transparent px-4 py-1.5 text-sm font-medium text-[#f5ede0]/60 transition hover:border-[#f5ede0]/30 hover:text-[#f5ede0]"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* ── Móvil ── */}
        <button
          className="sm:hidden rounded-full border border-[#5c3317]/50 px-3 py-1.5 text-[#f5ede0]/70 transition hover:border-[#c8922a]/50 hover:text-[#e5b56a]"
          aria-label="Abrir menú"
        >
          ☰
        </button>

      </div>
    </header>
  )
}

export default Header