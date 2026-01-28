import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../store/auth-context"
import type { Role } from "../types/auth"

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole?: Role
}) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  // Si no hay sesión, manda a login y recuerda la ruta original
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Si hay sesión pero no tiene rol, fuera (luego haremos 403)
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}
