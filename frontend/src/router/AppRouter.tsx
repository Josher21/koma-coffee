import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Admin from "../pages/Admin"
import ProtectedRoute from "./ProtectedRoute"
import Forbidden from "../pages/Forbidden"
import NotFound from "../pages/NotFound"

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
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default AppRouter
