import { useForm } from '@inertiajs/react'
import { FormEvent } from 'react'

interface UseFormHandlerProps<T extends object> {
  initialData: T
  postUrl: string
  validate?: (data: T) => true | { field: keyof T, message: string }
  onSuccess?: (page: any) => void
}

interface FormHandler<T> {
  data: T
  updateField: (field: keyof T, value: T[keyof T]) => void
  submit: (e?: FormEvent<HTMLFormElement>) => void
  processing: boolean
  errors: Partial<Record<keyof T, string>>
}

export function useFormHandler<T extends object> ({
  initialData,
  postUrl,
  validate,
  onSuccess
}: UseFormHandlerProps<T>): FormHandler<T> {
  const { data, setData, post, processing, errors, clearErrors, setError } = useForm<T>(initialData)

  function updateField (field: keyof T, value: T[keyof T]): void {
    setData(field, value)
    clearErrors(field)
  }

  function submit (e?: FormEvent<HTMLFormElement>): void {
    if (e !== undefined) {
      e.preventDefault()
    }

    if (typeof validate === 'function') {
      const validationResult = validate(data)
      if (validationResult !== true) {
        setError(validationResult.field, validationResult.message)
        return
      }
    }
    post(postUrl, { onSuccess })
  }

  return { data, updateField, submit, processing, errors }
}
