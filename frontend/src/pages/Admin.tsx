function Admin() {
  return (
    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Panel Admin</h1>
        <p className="mt-2 text-[var(--muted)]">Ruta protegida por rol ADMIN.</p>
      </div>
    </main>
  )
}

export default Admin
