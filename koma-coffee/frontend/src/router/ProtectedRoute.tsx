import { Navigate } from "react-router-dom"
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

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />

  return children
}
