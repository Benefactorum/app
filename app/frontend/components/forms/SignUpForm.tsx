import { ReactElement } from 'react'
import { SignUpData, useSignUpForm } from '@/hooks/useSignUpForm'
import { KeysWithStringValues } from '@/types/utilityTypes'
import { MyInput } from './MyInput'
import { MyCheckbox } from './MyCheckbox'
import { Link } from '@inertiajs/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Button } from '@/components/ui/button'
import { StepForward } from 'lucide-react'

export function SignUpForm (): ReactElement {
  const { data, errors, processing, signUpBlocked, recaptchaRef, updateField, submit } = useSignUpForm()

  function renderInput (id: KeysWithStringValues<SignUpData>, label: string, placeholder: string): ReactElement {
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
        error={errors[id]}
      />
    )
  }

  return (
    <form onSubmit={(e) => { void submit(e) }} className='w-full flex flex-col pt-4 gap-8'>
      {renderInput('first_name', 'Prénom :', 'Alain')}
      {renderInput('last_name', 'Nom :', 'Connu')}

      <MyCheckbox
        id='terms'
        required
        disabled={signUpBlocked}
        checked={data.accepts_conditions}
        onCheckedChange={checked => updateField('accepts_conditions', checked)}
        error={errors.terms_and_privacy_accepted_at}
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
