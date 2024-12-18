import { ReactElement } from 'react'
import { useConnectionForm } from '@/hooks/useConnectionForm'
import { MyInput } from './MyInput'
import { Button } from '@/components/ui/button'
import { StepForward } from 'lucide-react'

export function ConnectionForm (): ReactElement {
  const { data, errors, processing, updateEmail, validateAndSubmit } = useConnectionForm()

  return (
    <form
      onSubmit={e => validateAndSubmit(e)}
      className='w-full flex flex-col gap-8'
      aria-label='form'
    >
      <MyInput
        type='email'
        required
        autoFocus
        value={data.email}
        onChange={e => updateEmail(e.target.value)}
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
