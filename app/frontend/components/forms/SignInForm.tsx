import { ReactElement, useEffect, useState } from 'react'
import { useFormHandler } from '@/hooks/useFormHandler'
import { toast } from 'sonner'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { StepForward } from 'lucide-react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { InputError } from '@/components/forms/InputError'
import { z } from 'zod'

interface SignInData {
  email: string
  code: string
}

export default function SignInForm (): ReactElement {
  const [countdown, setCountdown] = useState<number>(60)

  const initialData: SignInData = {
    email: sessionStorage.getItem('email') ?? '',
    code: ''
  }

  const {
    data,
    updateField,
    submit,
    processing,
    errors
  } = useFormHandler<SignInData>({
    initialData,
    postUrl: '/sessions',
    validation: z.object({
      code: z.string().length(6, { message: 'Le code doit contenir 6 chiffres.' })
    })
  })

  useEffect(() => {
    if (data.email === '') {
      router.get('/connexion')
    }
  }, [data.email])

  useEffect(() => {
    // if (errors.code?.includes('Votre code de connexion a expiré. Demandez-en un nouveau.')) {
    if (typeof errors.code === 'string' && errors.code.includes('Votre code de connexion a expiré. Demandez-en un nouveau.')) {
      setCountdown(0)
    }
  }, [errors.code])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [countdown])

  function resendCode (): void {
    router.post('/otp', {}, {
      onSuccess: (page) => {
        if (page.url === '/se-connecter') {
          updateField('code', '')
          setCountdown(60)
          toast.success(`Un nouveau code a été envoyé à ${data.email ?? ''}`)
        }
      }
    })
  }

  // const canSubmit = !processing && data.code.length === 6 && errors.code === undefined

  return (
    <form onSubmit={submit} className='flex flex-col pt-4 mt-8 gap-8'>
      <div className='flex flex-col mx-auto'>
        <InputOTP
          autoFocus
          id='OTP'
          required
          maxLength={6}
          value={data.code}
          onChange={(value) => updateField('code', value)}
          pattern={REGEXP_ONLY_DIGITS}
          containerClassName='mx-auto'
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {Boolean(errors.code) && <InputError>{errors.code}</InputError>}
      </div>
      <Button
        type='submit'
        disabled={processing || Boolean(errors.code)}
      >
        <StepForward />
        Continuer
      </Button>

      {countdown > 0 && (
        <p className='text-sm text-muted-foreground mt-16'>
          Vous n&apos;avez pas reçu le code ?{' '}
          <span className='underline cursor-pointer'>
            Renvoyer dans {countdown} secondes
          </span>
        </p>
      )}
      {countdown === 0 && (
        <p className='text-sm text-muted-foreground mt-16'>
          <button
            onClick={resendCode}
            className='underline hover:text-primary'
            type='button'
          >
            Renvoyer un nouveau code
          </button>
        </p>
      )}
    </form>
  )
}
