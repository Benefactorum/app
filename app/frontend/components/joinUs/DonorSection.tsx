import Donor from '@/assets/images/joinUs/donor.webp'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Link } from '@inertiajs/react'
import { buttonVariants } from '@/components/ui/button'
import { HandHeart } from 'lucide-react'
import { ReactElement } from 'react'

const imageDescription =
  "Icône d'une main déposant une pièce dans une boîte de don ornée d'un cœur, symbolisant la générosité, le soutien aux causes sociales et l'engagement dans les actions caritatives."

export default function OurMission (): ReactElement {
  return (
    <div className='bg-white'>
      <div className='flex flex-col-reverse md:flex-row py-8 lg:py-16 2xl:container mx-auto px-2 sm:px-8 gap-8 lg:gap-16'>
        <div className='hidden md:flex md:w-1/3 justify-center items-center'>
          <div className='w-[200px] lg:w-[300px]'>
            <AspectRatio ratio={300 / 284.48}>
              <img
                src={Donor}
                alt={imageDescription}
                title={imageDescription}
              />
            </AspectRatio>
          </div>
        </div>
        <div className='flex flex-grow xl:flex-none md:w-2/3 flex-col justify-center gap-8'>
          <h2 className=' text-xl sm:text-2xl lg:text-3xl whitespace-pre-line font-semibold'>
            <span className='leading-snug'>
              Devenir donateur pour Benefactorum
            </span>
          </h2>
          <div className='md:hidden flex my-4 mx-auto'>
            <div className='w-[150px]'>
              <AspectRatio ratio={300 / 284.48}>
                <img
                  src={Donor}
                  alt={imageDescription}
                  title={imageDescription}
                />
              </AspectRatio>
            </div>
          </div>
          <p>
            Benefactorum est une organisation d’intérêt général, et peut
            recevoir des dons, ce qui constitue l’unique source de financement
            de la plateforme.
          </p>
          <p>Donner à Benefactorum ouvre à 66% d’exonération fiscale.</p>
          <p>
            En donnant à Benefactorum, vous lui permettez de couvrir ses frais
            de fonctionnement et de pérenniser son action.
          </p>
          <div className='flex justify-end'>
            <Link
              disabled
              href=''
              className={`${buttonVariants({
                variant: 'secondary',
                size: 'lg',
                mode: 'disabled'
              })}`}
            >
              <HandHeart />
              Faire un don
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
