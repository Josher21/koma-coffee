import { NavLink } from "react-router-dom"

function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "px-3 py-2 rounded-lg",
      isActive ? "bg-[var(--bg)] text-[var(--ink)]" : "text-[var(--ink)] hover:bg-[var(--bg)]",
    ].join(" ")

  return (
    <header className="w-full border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[var(--ink)] text-white grid place-items-center font-semibold">
            K
          </div>
          <div className="leading-tight">
            <p className="text-[var(--ink)] font-semibold">Koma Coffee</p>
            <p className="text-sm text-[var(--muted)]">Café + cultura cómic</p>
          </div>
        </div>

        <nav className="hidden sm:flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>

          <NavLink to="/register" className={linkClass}>
            Registro
          </NavLink>
        </nav>

        <button
          className="sm:hidden px-3 py-2 rounded-lg border border-[var(--line)] text-[var(--ink)]"
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>
    </header>
  )
}

export default Header
