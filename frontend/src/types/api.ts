export type LaravelValidationError = {
  message: string
  errors: Record<string, string[]>
}

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
  }
}
