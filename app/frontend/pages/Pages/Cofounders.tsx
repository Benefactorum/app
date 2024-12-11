import { Head } from '@inertiajs/react'
import HeroSection from '@/components/cofounders/HeroSection'
import Members from '@/components/cofounders/Members'
import QuoteSection from '@/components/reusable/QuoteSection'
import { ReactElement } from 'react'

export default function AboutUs (): ReactElement {
  return (
    <>
      <Head>
        <title>Co-fondateurs</title>
        <meta name='description' content='Your page description' />
      </Head>
      <HeroSection />
      <Members />
      <QuoteSection
        white={false}
        quote={<span>Personne n'est jamais devenu pauvre en donnant.</span>}
        author={<span>Anne Frank</span>}
      />
    </>
  )
}
