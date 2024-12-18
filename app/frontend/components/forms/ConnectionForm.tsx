import { ReactElement } from 'react'
import { useFormHandler } from '@/hooks/useFormHandler'
import { z } from 'zod'
import { MyInput } from './MyInput'
import { Button } from '@/components/ui/button'
import { StepForward } from 'lucide-react'

const emailSchema = z.string().email({ message: 'Veuillez entrer une adresse email valide.' })

export function ConnectionForm (): ReactElement {
  const { data, updateField, submit, processing, errors } = useFormHandler({
    initialData: { email: sessionStorage.getItem('email') ?? '' },
    postUrl: '/connection',
    validate: (data) => {
      const validation = emailSchema.safeParse(data.email)
      return validation.success
        ? true
        : { field: 'email', message: validation.error.errors[0].message }
    },
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

  return (
    <form
      onSubmit={submit}
      className='w-full flex flex-col gap-8'
      aria-label='form'
    >
      <MyInput
        type='email'
        required
        autoFocus
        value={data.email}
        onChange={(e) => updateField('email', e.target.value)}
        placeholder='Votre adresse email'
        error={errors.email}
      />

      <Button type='submit' disabled={processing || Boolean(errors.email)}>
        <StepForward />
        Continuer
      </Button>
    </form>
  )
}
