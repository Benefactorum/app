import { useForm } from '@inertiajs/react'
import { ZodType } from 'zod'
import { FormEvent } from 'react'
import { validate } from '@/lib/validate'

interface UseFormHandlerProps<T extends Record<string, any>> {
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

export default function useFormHandler<T extends Record<string, any>> ({ initialData, postUrl, validation, onSuccess }: UseFormHandlerProps<T>): FormHandler<T> {
  const { data, setData, post, processing, errors, clearErrors, setError } = useForm<T>(initialData)

  function updateField (field: keyof T, value: T[keyof T]): void {
    setData(field, value)
    clearErrors(field)
  }

  function submit (e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()

    if (validation !== undefined && !validate(validation, data, setError)) {
      return
    }
    post(postUrl, { onSuccess })
  }

  return { data, updateField, submit, processing, errors }
}
