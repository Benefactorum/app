import CharityCarousel from '@/components/pages/pages/home/CharityCarousel'
import CauseCarousel from '@/components/pages/pages/home/CauseCarousel'
import { ReactElement } from 'react'

export default function CharitySection (): ReactElement {
  return (
    <div className='bg-white py-8 pb-16 overflow-x-hidden'>
      <CharityCarousel />
      <div className='2xl:container mx-auto flex flex-col'>
        <h2 className='px-2 sm:px-4 my-16 text-xl sm:text-2xl md:text-3xl font-semibold'>
          Soutenez les causes qui vous tiennent à coeur
        </h2>
        <CauseCarousel />
      </div>
    </div>
  )
}
