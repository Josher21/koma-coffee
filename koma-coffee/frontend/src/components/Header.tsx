import { NavLink } from "react-router-dom"
import { useAuth } from "../store/auth-context" // ajusta el nombre si lo dejaste diferente

function Header() {
  const { isAuthenticated, auth, role, logout } = useAuth()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "px-3 py-2 rounded-lg",
      isActive ? "bg-[var(--bg)] text-[var(--ink)]" : "text-[var(--ink)] hover:bg-[var(--bg)]",
    ].join(" ")

  return (
    <header className="w-full border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        {/* Marca */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[var(--ink)] text-white grid place-items-center font-semibold">
            K
          </div>
          <div className="leading-tight">
            <p className="text-[var(--ink)] font-semibold">Koma Coffee</p>
            <p className="text-sm text-[var(--muted)]">Café + cultura cómic</p>
          </div>
        </div>

        {/* Links */}
        <nav className="hidden sm:flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Registro
              </NavLink>
            </>
          )}

          {isAuthenticated && role === "ADMIN" && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Área de sesión */}
        <div className="hidden sm:flex items-center gap-3">
          {!isAuthenticated ? (
            <span className="text-sm text-[var(--muted)]">No autenticado</span>
          ) : (
            <>
              <span className="text-sm text-[var(--muted)]">
                Hola, <span className="text-[var(--ink)] font-semibold">{auth.user?.name}</span>{" "}
                <span className="ml-2 px-2 py-1 rounded-md bg-[var(--bg)] text-[var(--coffee)] text-xs font-semibold">
                  {role}
                </span>
              </span>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--bg)]"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Móvil (solo visual por ahora) */}
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
