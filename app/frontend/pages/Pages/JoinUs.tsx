import { Head } from '@inertiajs/react'
import HeroSection from '@/components/pages/pages/joinUs/HeroSection'
import DonorSection from '@/components/pages/pages/joinUs/DonorSection'
import MemberSection from '@/components/pages/pages/joinUs/MemberSection'
import ModeratorSection from '@/components/pages/pages/joinUs/ModeratorSection'
import ContributorSection from '@/components/pages/pages/joinUs/ContributorSection'
import QuoteSection from '@/components/pages/QuoteSection'
import { ReactElement } from 'react'

export default function JoinUs (): ReactElement {
  return (
    <>
      <Head>
        <title>Nous rejoindre</title>
        <meta name='description' content='Your page description' />
      </Head>
      <HeroSection />
      <DonorSection />
      <MemberSection />
      <ModeratorSection />
      <ContributorSection />
      <QuoteSection
        quote={<span>L'important, c'est de participer.</span>}
        author={<span>Pierre de Coubertin</span>}
      />
    </>
  )
}
