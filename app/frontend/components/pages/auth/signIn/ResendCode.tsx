import { ReactElement, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { router } from '@inertiajs/react'

interface Props {
  email: string
  onSuccess: () => void
  codeExpired: boolean
}

export default function SignInForm ({ email, onSuccess, codeExpired }: Props): ReactElement {
  const [countdown, setCountdown] = useState<number>(60)

  useEffect(() => {
    if (codeExpired) {
      setCountdown(0)
    }
  }, [codeExpired])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [countdown])

  function resendCode (): void {
    router.post('/otp', {
      email
    }, {
      onSuccess: (page) => {
        if (page.url === '/se-connecter') {
          onSuccess()
          setCountdown(60)
          toast.success(`Un nouveau code a été envoyé à ${email}`)
        }
      }
    })
  }

  return (
    <p className='text-sm text-muted-foreground mt-16'>
      {countdown > 0
        ? (
          <>
            Vous n&apos;avez pas reçu le code ?{' '}
            <span className='underline cursor-pointer'>
              Renvoyer dans {countdown} secondes
            </span>
          </>
          )
        : (
          <button
            onClick={resendCode}
            className='underline hover:text-primary'
            type='button'
          >
            Renvoyer un nouveau code
          </button>
          )}
    </p>
  )
}
