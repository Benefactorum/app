import HeroSection from '@/components/pages/pages/home/HeroSection'
import CharitySection from '@/components/pages/pages/home/CharitySection'
import JoinUsSection from '@/components/pages/pages/home/JoinUsSection'
import FaqSection from '@/components/pages/pages/home/FaqSection'
import QuoteSection from '@/components/pages/QuoteSection'
// @ts-expect-error
import Smiley from '@/assets/images/pages/home/quote/smiley.svg?react'
import { ReactElement } from 'react'

export default function Home (): ReactElement {
  return (
    <>
      <HeroSection />
      <CharitySection />
      <JoinUsSection />
      <FaqSection />
      <QuoteSection
        white={false}
        quote={<span>Grâce à Benefactorum, je me sens plus heureux !</span>}
        author={
          <span>
            Vous, une fois inscrit
            <Smiley className='inline-block ml-2 w-6 h-6 mb-1' />
          </span>
        }
      />
    </>
  )
}
