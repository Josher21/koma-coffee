import Header from "./components/Header"
import Footer from "./components/Footer"
import AppRouter from "./router/AppRouter"

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* El contenido ocupa todo el espacio disponible */}
      <main className="flex-1">
        <AppRouter />
      </main>

      <Footer />
    </div>
  )
}

export default App