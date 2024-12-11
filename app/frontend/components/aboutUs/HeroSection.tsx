import BenefactorumLogo from '@/assets/images/aboutUs/benefactorum.svg'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ReactElement } from 'react'

const imageDescription =
  'Logo de Benefactorum, représentant deux mains qui se donnent, dans un labyrinthe'

export default function HeroSection (): ReactElement {
  return (
    <div className='flex flex-col sm:flex-row py-8 2xl:container mx-auto px-2 sm:px-8 lg:px-16 gap-8 lg:gap-16'>
      <div className='flex flex-grow xl:flex-none lg:w-1/2 flex-col justify-center gap-8 lg:gap-16'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl whitespace-pre-line'>
          <span className='leading-snug'>
            Vous prenez soin des autres ?{'\n'}
            On prend soin de <span className='font-semibold'>vous !</span>
          </span>
        </h1>
        <div className='flex sm:hidden justify-center items-center'>
          <div className='w-[200px]'>
            <AspectRatio ratio={1}>
              <img
                src={BenefactorumLogo}
                alt={imageDescription}
                title={imageDescription}
              />
            </AspectRatio>
          </div>
        </div>
        <h2 className='sm:text-xl lg:text-2xl'>
          Découvrez Benefactorum, l’organisation d’intérêt général qui facilite
          la vie des donateurs !
        </h2>
      </div>
      <div className='hidden sm:flex sm:w-1/2 md:w-1/3 lg:w-1/2 justify-center items-center'>
        <div className='w-[200px] md:w-[400px]'>
          <AspectRatio ratio={1}>
            <img
              src={BenefactorumLogo}
              alt={imageDescription}
              title={imageDescription}
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}
