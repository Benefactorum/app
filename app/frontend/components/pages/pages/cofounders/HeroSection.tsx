import Colibri from '@/assets/images/pages/cofounders/colibri.webp'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ReactElement } from 'react'

const imageDescription =
  "Illustration minimaliste du conte du colibri tentant d'éteindre un feu de forêt en transportant une goutte d'eau, symbolisant l'effort individuel et l'engagement face aux grands défis, même si le geste peut sembler insignifiant."

export default function HeroSection (): ReactElement {
  return (
    <div className='flex flex-col sm:flex-row py-8 2xl:container mx-auto px-2 sm:px-8 lg:px-16 gap-8 lg:gap-16'>
      <div className='flex flex-grow xl:flex-none lg:w-1/2 flex-col justify-center gap-8 lg:gap-16'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-semibold'>
          Notre équipe
        </h1>
        <div className='flex sm:hidden justify-center items-center'>
          <div className='w-[200px]'>
            <AspectRatio ratio={1}>
              <img
                src={Colibri}
                alt={imageDescription}
                title={imageDescription}
              />
            </AspectRatio>
          </div>
        </div>
        <h2 className='sm:text-xl lg:text-2xl'>
          Benefactorum est née de la société civile, de citoyens un poil
          idéalistes, désireux de faire leur part.
        </h2>
      </div>
      <div className='hidden sm:flex sm:w-1/2 md:w-1/3 lg:w-1/2 justify-center items-center'>
        <div className='w-[200px]'>
          <AspectRatio ratio={1}>
            <img
              src={Colibri}
              alt={imageDescription}
              title={imageDescription}
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}
