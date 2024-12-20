import { ReactElement } from 'react'
import useFormHandler from '@/hooks/useFormHandler'
import { Label } from '@/components/ui/label'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { z } from 'zod'
import InputError from '@/components/forms/InputError'
import { Button } from '@/components/ui/button'
import { StepForward } from 'lucide-react'
import ResendCode from '@/components/pages/auth/signIn/ResendCode'

interface SignInData {
  email: string
  code: string
}

export default function SignInForm ({ email }: { email: string }): ReactElement {
  const { data, updateField, submit, processing, errors } = useFormHandler<SignInData>({
    initialData: {
      email,
      code: ''
    },
    postUrl: '/sessions',
    validation: z.object({
      code: z.string().length(6, { message: 'Le code doit contenir 6 chiffres.' })
    })
  })

  function isCodeExpired (): boolean {
    // inconsistency between @inertia/react use-form type (string) and rails usage(string[])
    return Array.isArray(errors.code) && errors.code.includes('Votre code de connexion a expiré. Demandez-en un nouveau.')
  }

  return (
    <>
      <form onSubmit={submit} className='flex flex-col pt-4 mt-8 gap-8'>
        <div className='flex flex-col mx-auto'>
          <Label htmlFor='OTP' className='sr-only'>Code</Label>
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
      </form>
      <ResendCode email={data.email} onSuccess={() => updateField('code', '')} codeExpired={isCodeExpired()} />
    </>
  )
}
