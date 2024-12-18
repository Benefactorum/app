import { useEffect, useRef, FormEvent } from 'react'
import { router, useForm } from '@inertiajs/react'
import ReCAPTCHA from 'react-google-recaptcha'

export interface SignUpData {
  email: string
  first_name: string
  last_name: string
  accepts_conditions: boolean
  terms_and_privacy_accepted_at: string
  recaptcha_token: string
}

interface SignUpForm {
  data: SignUpData
  errors: Partial<Record<keyof SignUpData, string>>
  processing: boolean
  signUpBlocked: boolean
  recaptchaRef: React.RefObject<ReCAPTCHA | null>
  updateField: (field: keyof SignUpData, value: string | boolean) => void
  submit: (e: FormEvent<HTMLFormElement>) => Promise<void>
}

export function useSignUpForm (): SignUpForm {
  const { data, setData, post, processing, errors, clearErrors } = useForm<SignUpData>({
    email: sessionStorage.getItem('email') ?? '',
    first_name: sessionStorage.getItem('firstName') ?? '',
    last_name: sessionStorage.getItem('lastName') ?? '',
    accepts_conditions: Boolean(sessionStorage.getItem('acceptsConditions')),
    terms_and_privacy_accepted_at: '',
    recaptcha_token: ''
  })

  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const signUpBlocked = Boolean(sessionStorage.getItem('signUpBlocked'))

  useEffect(() => {
    if (data.email === '') {
      router.get('/connexion')
    }
  }, [data.email])

  function updateField (field: keyof SignUpData, value: string | boolean): void {
    setData(field, value)
    clearErrors(field)
  }

  async function submit (e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (data.recaptcha_token === '') {
      const token = (recaptchaRef.current != null) ? await recaptchaRef.current.executeAsync() as string : ''
      data.recaptcha_token = token
    }
    post('registration', {
      onSuccess: (page) => {
        if (page.url === '/se-connecter') {
          sessionStorage.setItem('firstName', data.first_name)
          sessionStorage.setItem('lastName', data.last_name)
          sessionStorage.setItem('signUpBlocked', 'true')
          sessionStorage.setItem('acceptsConditions', 'true')
        }
      }
    })
  }

  return {
    data,
    errors,
    processing,
    signUpBlocked,
    recaptchaRef,
    updateField,
    submit
  }
}
