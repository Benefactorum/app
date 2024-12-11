import { Head } from '@inertiajs/react'
import HeroSection from '@/components/joinUs/HeroSection'
import DonorSection from '@/components/joinUs/DonorSection'
import MemberSection from '@/components/joinUs/MemberSection'
import ModeratorSection from '@/components/joinUs/ModeratorSection'
import ContributorSection from '@/components/joinUs/ContributorSection'
import QuoteSection from '@/components/reusable/QuoteSection'
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
