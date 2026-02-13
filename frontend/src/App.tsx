// Importamos los componentes que forman la estructura general de la web
import Header from "./components/Header"
import Footer from "./components/Footer"
import AppRouter from "./router/AppRouter"

// Este es el "contenedor base" donde se monta toda la interfaz.
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
// Exportamos el componente para que pueda ser usado en main.tsx
export default App