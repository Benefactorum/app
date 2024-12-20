import { useForm } from '@inertiajs/react'
import { ZodType } from 'zod'
import { FormEvent } from 'react'

interface UseFormHandlerProps<T extends object> {
  initialData: T
  postUrl: string
  validation?: ZodType<Partial<T>>
  onSuccess?: (page: any) => void
}

interface FormHandler<T> {
  data: T
  updateField: (field: keyof T, value: T[keyof T]) => void
  submit: (e: FormEvent<HTMLFormElement>) => void
  processing: boolean
  errors: Partial<Record<keyof T, string>>
}

export default function useFormHandler<T extends object> ({ initialData, postUrl, validation, onSuccess }: UseFormHandlerProps<T>): FormHandler<T> {
  const { data, setData, post, processing, errors, clearErrors, setError } = useForm<T>(initialData)

  function updateField (field: keyof T, value: T[keyof T]): void {
    setData(field, value)
    clearErrors(field)
  }

  function submit (e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()

    if (validation !== undefined) {
      const result = validation.safeParse(data)
      if (!result.success) {
        const issues = result.error.issues
        issues.forEach(issue => {
          setError(issue.path.join('.') as keyof T, issue.message)
        })
        return
      }
    }
    post(postUrl, { onSuccess })
  }

  return { data, updateField, submit, processing, errors }
}
