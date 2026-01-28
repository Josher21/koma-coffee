import { Routes, Route, Navigate } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Cualquier ruta desconocida -> Home (o 404 más adelante) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
