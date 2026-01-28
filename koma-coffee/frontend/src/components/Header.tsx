function Header() {
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

        {/* Navegación provisional (luego será Router) */}
        <nav className="hidden sm:flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg text-[var(--ink)] hover:bg-[var(--bg)]">
            Home
          </button>
          <button className="px-3 py-2 rounded-lg text-[var(--ink)] hover:bg-[var(--bg)]">
            Carta
          </button>
          <button className="px-3 py-2 rounded-lg text-[var(--ink)] hover:bg-[var(--bg)]">
            Contacto
          </button>

          <span className="mx-2 h-6 w-px bg-[var(--line)]" />

          <button className="px-3 py-2 rounded-lg border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--bg)]">
            Login
          </button>
          <button className="px-3 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-2)]">
            Registro
          </button>
        </nav>

        {/* Botón móvil (solo visual, luego le daremos funcionalidad) */}
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
