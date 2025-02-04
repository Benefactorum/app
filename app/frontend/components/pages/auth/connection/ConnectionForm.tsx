import { ReactElement } from 'react'
import useFormHandler from '@/hooks/useFormHandler'
import { z } from 'zod'
import MyInput from '../../../shared/MyInput'
import { Button } from '@/components/ui/button'
import { StepForward } from 'lucide-react'

export default function ConnectionForm (): ReactElement {
  const { data, updateField, submit, processing, errors } = useFormHandler({
    initialData: { email: sessionStorage.getItem('email') ?? '' },
    postUrl: '/connection',
    validation: z.object({
      email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' })
    }),
    onSuccess: (page) => {
      if (page.url !== '/connexion') {
        sessionStorage.setItem('email', data.email)
        sessionStorage.removeItem('firstName')
        sessionStorage.removeItem('lastName')
        sessionStorage.removeItem('acceptsConditions')
        sessionStorage.removeItem('signUpBlocked')
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
        id='email'
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
