import { ReactElement } from 'react'

export default function HeroSection (): ReactElement {
  return (
    <div className='flex flex-col py-8 sm:py-12 2xl:container mx-auto px-2 sm:px-8 lg:px-16 gap-8 lg:gap-16'>
      <h1 className='text-2xl sm:text-3xl lg:text-4xl font-semibold'>
        Nous rejoindre
      </h1>
      <h2 className='sm:text-xl lg:text-2xl whitespace-pre-line'>
        Vous êtes aligné avec la démarche de Benefactorum ?{'\n'}Il y a
        différentes manières d’apporter votre pierre à l’édifice.
      </h2>
    </div>
  )
}
