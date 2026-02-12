import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Admin from "../pages/Admin"
import ProtectedRoute from "./ProtectedRoute"
import Forbidden from "../pages/Forbidden"
import NotFound from "../pages/NotFound"
import ApiStatus from "../pages/ApiStatus"
import Catalog from "../pages/Catalog"
import MyReservations from "../pages/MyReservations"
import BookDetail from "../pages/BookDetail"

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalog />} />
      <Route path="/catalogo/:id" element={<BookDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="ADMIN">
        <Admin />
        </ProtectedRoute>
        } />
      <Route path="/403" element={<Forbidden />} />
      <Route path="/status" element={<ApiStatus />} />
      <Route path="/reservas" element={<MyReservations />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
