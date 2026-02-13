import { ApiError } from "../types/api"
import { loadAuth } from "../store/authStorage"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

// Opciones configurables para cada petición
type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  auth?: boolean // por defecto true: añade Bearer si hay token
}

// URL base de la API (definida en .env)
const BASE_URL = import.meta.env.VITE_API_URL as string

function hasMessage(x: unknown): x is { message: string } {
  return !!x && typeof x === "object" && "message" in x && typeof (x as any).message === "string"
}

// Función principal que ejecuta cualquier petición HTTP
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, auth = true } = options

  // Construimos la URL final
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`

  // Cabeceras base
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  }

  // Si enviamos datos, añadimos Content-Type
  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json"
  }

  if (auth) {
    const { token } = loadAuth()
    // Añadimos token Bearer automáticamente
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  // Ejecutamos la petición usando fetch
  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  // 204 (sin contenido)
  if (res.status === 204) return null as T

  const contentType = res.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")

  // Parseamos la respuesta
  const data: unknown = isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null)

     // Si la respuesta no fue correcta (ej: 401, 403, 500...)
  if (!res.ok) {
    const message = hasMessage(data)
      ? data.message                                // Intentamos extraer mensaje desde la API
      : `Request failed with status ${res.status}`

    throw new ApiError(message, res.status, data)
  }
  // devolvemos los datos tipados
  return data as T
}

// API pública que usará el resto del proyecto
export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),

  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" }),
}