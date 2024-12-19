import { ReactElement } from 'react'
import { Head } from '@inertiajs/react'
import QuoteSection from '@/components/pages/QuoteSection'
import SignInForm from '@/components/forms/SignInForm'

export default function SignIn (): ReactElement {
  const email = sessionStorage.getItem('email')

  return (
    <>
      <Head>
        <title>S'inscrire</title>
        <meta name='description' content='Your page description' />
      </Head>
      <div className='flex mx-auto justify-center py-16 lg:px-16 overflow-x-hidden'>
        <div className='bg-white py-8 px-4 sm:px-8 md:p-16 rounded-2xl flex flex-col max-w-[653px]'>
          <h1 className='text-2xl sm:text-3xl font-semibold '>
            Connectez-vous !
          </h1>
          <div className='flex flex-col gap-4 mt-8 '>
            <p>
              Une fois que vous aurez saisi le code que nous avons envoyé à
              l'adresse <span className='font-medium italic'>{email}</span>,
              vous serez connecté.
            </p>
            <p>Il est valide durant 10 minutes.</p>
          </div>
          <SignInForm />
        </div>
      </div>
      <QuoteSection
        quote={
          <span>
            Tout est question d'espoir, de gentillesse et de connexion les uns
            avec les autres.
          </span>
        }
        author={<span>Elizabeth Taylor</span>}
      />
    </>
  )
}
