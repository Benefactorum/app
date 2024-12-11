import ContribOSS from '@/assets/images/joinUs/contrib-oss.webp'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { buttonVariants } from '@/components/ui/button'
import { SearchCode } from 'lucide-react'
import { ReactElement } from 'react'

const imageDescription =
  "Icône illustrant un projet open source sur GitHub, montrant des développeurs collaborant autour de lignes de code, symbolisant le travail collectif, le partage des connaissances et l'innovation ouverte dans la communauté technologique."

export default function Together (): ReactElement {
  return (
    <div className='flex flex-col md:flex-row py-8 lg:py-16 2xl:container mx-auto px-2 sm:px-8 gap-8 lg:gap-16'>
      <div className='flex flex-grow xl:flex-none md:w-2/3 flex-col justify-center gap-8'>
        <h2 className=' text-xl sm:text-2xl lg:text-3xl whitespace-pre-line font-semibold'>
          <span className='leading-snug'>
            Devenir contributeur <span className='italic'>open source</span>{' '}
            pour Benefactorum
          </span>
        </h2>
        <div className='flex md:hidden my-4 mx-auto'>
          <div className='w-[230px]'>
            <AspectRatio ratio={1}>
              <img
                src={ContribOSS}
                alt={imageDescription}
                title={imageDescription}
              />
            </AspectRatio>
          </div>
        </div>
        <p>
          Benefactorum développe une plateforme{' '}
          <span className='italic'>open source</span>.
        </p>
        <p>
          Que vous soyez codeur expert ou débutant, venez faire un tour sur
          notre <span className='italic'>repo</span> !
        </p>
        <div className='flex justify-end md:justify-start'>
          <a
            href='https://github.com/Benefactorum/app'
            target='_blank'
            rel='noopener noreferrer'
            className={`${buttonVariants({
              size: 'lg'
            })}`}
          >
            <SearchCode />
            Voir le code
          </a>
        </div>
      </div>
      <div className='hidden md:flex md:w-1/3 justify-center items-center'>
        <div className='w-[330px]'>
          <AspectRatio ratio={1}>
            <img
              src={ContribOSS}
              alt={imageDescription}
              title={imageDescription}
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}
