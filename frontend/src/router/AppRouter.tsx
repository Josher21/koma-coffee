import { Routes, Route, Navigate } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Admin from "../pages/Admin"
import ProtectedRoute from "./ProtectedRoute"
import Forbidden from "../pages/Forbidden"

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="ADMIN">
        <Admin />
        </ProtectedRoute>
        } />
        <Route path="/403" element={<Forbidden />} />

      {/* Cualquier ruta desconocida -> Home (o 404 más adelante) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
