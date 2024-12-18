import { useEffect, useRef, ReactElement, FormEvent } from 'react'
import { router, Link } from '@inertiajs/react'
import { useFormHandler } from '@/hooks/useFormHandler'
import { KeysWithStringValues } from '@/types/utilityTypes'
import { MyInput } from './MyInput'
import { MyCheckbox } from './MyCheckbox'
import ReCAPTCHA from 'react-google-recaptcha'
import { Button } from '@/components/ui/button'
import { StepForward } from 'lucide-react'

interface SignUpData {
  email: string
  first_name: string
  last_name: string
  accepts_conditions: boolean
  recaptcha_token: string
}

export function SignUpForm (): ReactElement {
  const {
    data,
    processing,
    updateField,
    submit
  } = useFormHandler<SignUpData>({
    initialData: {
      email: sessionStorage.getItem('email') ?? '',
      first_name: sessionStorage.getItem('firstName') ?? '',
      last_name: sessionStorage.getItem('lastName') ?? '',
      accepts_conditions: Boolean(sessionStorage.getItem('acceptsConditions')),
      recaptcha_token: ''
    },
    postUrl: '/signup'
  })

  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const signUpBlocked = Boolean(sessionStorage.getItem('signUpBlocked'))

  useEffect(() => {
    if (data.email === '') {
      router.get('/connexion')
    }
  }, [data.email])

  async function submit2 (e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    const token = (recaptchaRef.current != null) ? await recaptchaRef.current.executeAsync() as string : ''
    data.recaptcha_token = token
    submit()
  }

  function renderInput (
    id: KeysWithStringValues<SignUpData>,
    label: string,
    placeholder: string
  ): ReactElement {
    return (
      <MyInput
        id={id}
        labelText={label}
        type='text'
        required
        disabled={signUpBlocked}
        value={data[id]}
        onChange={e => updateField(id, e.target.value)}
        placeholder={placeholder}
      />
    )
  }

  return (
    <form onSubmit={e => { void submit2(e) }} className='w-full flex flex-col pt-4 gap-8'>
      {renderInput('first_name', 'Prénom :', 'Alain')}
      {renderInput('last_name', 'Nom :', 'Connu')}

      <MyCheckbox
        id='accepts_conditions'
        required
        disabled={signUpBlocked}
        checked={data.accepts_conditions}
        onCheckedChange={checked => updateField('accepts_conditions', checked)}
      >
        Je confirme avoir lu et accepté les{' '}
        <Link
          href='/mentions-legales'
          target='_blank'
          className='underline hover:text-primary'
        >
          Termes et Conditions
        </Link>{' '}
        et la{' '}
        <Link
          href='/donnees-personnelles'
          target='_blank'
          className='underline hover:text-primary'
        >
          Politique de Confidentialité
        </Link>{' '}
        de Benefactorum.
      </MyCheckbox>

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey='6LfkEYUqAAAAAOacT9yEDlhWHnXbaZ5IJhVFbXIf'
        size='invisible'
      />

      <Button
        variant='secondary'
        type='submit'
        disabled={signUpBlocked || processing}
      >
        <StepForward />
        Continuer
      </Button>
    </form>
  )
}
