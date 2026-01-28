import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../store/auth-context"

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Validación local simple (nivel alumno)
  function validate() {
    if (name.trim().length < 2) return "El nombre debe tener al menos 2 caracteres."
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Email no válido."
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres."
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }

    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      navigate("/", { replace: true })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error en registro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-[var(--bg)] min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-[var(--ink)]">Registro</h1>
        <p className="mt-2 text-[var(--muted)]">
          Registro real contra Laravel. Al registrarte, iniciarás sesión automáticamente.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-6"
        >
          <label className="block text-sm font-semibold text-[var(--ink)]">
            Nombre
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white p-2"
              placeholder="Jose Luis"
              required
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-[var(--ink)]">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white p-2"
              placeholder="jose@koma.local"
              required
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-[var(--ink)]">
            Contraseña
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white p-2"
              placeholder="mínimo 6 caracteres"
              required
            />
          </label>

          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] disabled:opacity-60"
          >
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Register
