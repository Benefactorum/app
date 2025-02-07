import { z } from 'zod'

export function validate<T> (
  schema: z.ZodSchema<T>,
  data: T,
  setError: (field: keyof T, value: string) => void
): boolean {
  const result = schema.safeParse(data)
  if (result.success) {
    return true
  }

  const issues = result.error.issues

  issues.forEach(issue => {
    const field = issue.path.join('.')
    setError(field as keyof T, issue.message)
  })

  return false
}
