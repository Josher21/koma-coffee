function Home() {
  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center">
      <div className="max-w-6xl mx-auto w-full p-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Bienvenido a Koma Coffee
          </h2>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Descubre nuestro café, nuestros espacios y la cultura que une
            el mundo del cómic con el café de especialidad.
          </p>

          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90">
              Ver carta
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
              Conocer la marca
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
