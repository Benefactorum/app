import { ReactElement, FormEvent } from 'react'
import { useForm } from '@inertiajs/react'
import { z } from 'zod'
import MyInput from './MyInput'
import { Button } from '@/components/ui/button'
import { StepForward } from 'lucide-react'

export default function ConnectionForm (): ReactElement {
  const validationSchema = z.object({
    email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' })
  })

  const { data, setData, post, processing, errors, clearErrors, setError } = useForm('connection', {
    email: ''
  })

  function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
    const { id, value } = e.target
    setData(id as keyof typeof data, value)
    clearErrors(id as keyof typeof data)
  }

  function submit (e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()

    const validation = validationSchema.safeParse(data)
    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        setError(issue.path[0] as keyof typeof data, issue.message)
      })
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

  return (
    <form onSubmit={submit} className='w-full flex flex-col gap-8' aria-label='form'>
      <MyInput
        id='email'
        type='email'
        required
        autoFocus
        value={data.email}
        onChange={handleChange}
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
