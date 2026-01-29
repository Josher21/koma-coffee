import { api } from "../apiClient"
import type { Category } from "../../types/library"

export async function getCategories(): Promise<Category[]> {
  // público, no necesita token
  return api.get<Category[]>("/categories", { auth: false })
}
