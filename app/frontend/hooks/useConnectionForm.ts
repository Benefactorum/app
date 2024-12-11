import { useForm } from '@inertiajs/react'
import { z } from 'zod'

const emailSchema = z
  .string()
  .email({ message: 'Veuillez entrer une adresse email valide.' })

interface ConnectionForm {
  data: { email: string }
  errors: Record<string, string>
  processing: boolean
  updateEmail: (value: string) => void
  validateAndSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function useConnectionForm (): ConnectionForm {
  const { data, setData, post, processing, errors, setError, clearErrors } =
    useForm({
      email: sessionStorage.getItem('email') ?? ''
    })

  function validateAndSubmit (e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const validation = emailSchema.safeParse(data.email)
    if (!validation.success) {
      setError('email', validation.error.errors[0].message)
      return
    }

    post('/connection', {
      onSuccess: (page) => {
        if (page.url !== '/connexion') {
          sessionStorage.setItem('email', data.email)
          sessionStorage.removeItem('firstName')
          sessionStorage.removeItem('lastName')
          sessionStorage.removeItem('signUpBlocked')
          sessionStorage.removeItem('acceptsConditions')
        }
      }
    })
  }

  function updateEmail (value: string): void {
    setData('email', value)
    clearErrors('email')
  }

  return {
    data,
    errors,
    processing,
    updateEmail,
    validateAndSubmit
  }
}
