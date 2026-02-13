export type Role = "ADMIN" | "USER"

export type AuthUser = {
  id: number
  name: string
  email: string
  role: Role
}

export type AuthState = {
  token: string | null
  user: AuthUser | null
}
