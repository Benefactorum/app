import { Head } from '@inertiajs/react'
import HeroSection from '@/components/pages/pages/aboutUs/HeroSection'
import OurMission from '@/components/pages/pages/aboutUs/OurMission'
import Together from '@/components/pages/pages/aboutUs/Together'
import NonProfit from '@/components/pages/pages/aboutUs/NonProfit'
import QuoteSection from '@/components/pages/QuoteSection'
import { ReactElement } from 'react'

export default function AboutUs (): ReactElement {
  return (
    <>
      <Head>
        <title>Qui nous sommes</title>
        <meta name='description' content='Your page description' />
      </Head>
      <HeroSection />
      <OurMission />
      <Together />
      <NonProfit />
      <QuoteSection
        white={false}
        quote={
          <span>
            L'exemple n'est pas le meilleur moyen de convaincre,{'\n'}c'est le
            seul.
          </span>
        }
        author={<span>Albert Schweitzer</span>}
      />
    </>
  )
}
