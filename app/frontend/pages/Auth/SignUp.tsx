import { Head } from '@inertiajs/react'
import { ReactElement } from 'react'
import { SignUpForm } from '@/components/forms/SignUpForm'
import QuoteSection from '@/components/reusable/QuoteSection'
import Vomi from '@/assets/images/auth/vomi.svg?react'

export default function SignUp (): ReactElement {
  const email = sessionStorage.getItem('email')

  return (
    <>
      <Head>
        <title>S'inscrire</title>
        <meta name='description' content='Your page description' />
      </Head>
      <div className='flex mx-auto justify-center py-16 lg:px-16'>
        <div className='bg-white p-8 md:p-16 rounded-2xl flex flex-col gap-8 max-w-[702px]'>
          <h1 className='text-2xl sm:text-3xl font-semibold'>
            Créez votre compte !
          </h1>
          <p className='flex flex-col'>
            Vous êtes en train de créer un compte sur Benefactorum avec
            l'adresse <span className='font-medium italic'>{email}</span>
          </p>
          <SignUpForm />
        </div>
      </div>
      <QuoteSection
        quote={<span>Avec Benefactorum, je suis hyper content !</span>}
        author={
          <span>
            Simon Jérémi (
            <a
              href='https://www.youtube.com/watch?v=sjErA1fL5JU'
              target='_blank'
              rel='noopener noreferrer'
              className='underline hover:text-primary'
            >
              La cité de la peur
            </a>
            )
            <Vomi className='inline-block ml-2 w-6 h-6' />
          </span>
        }
      />
    </>
  )
}
