import { Head } from "@inertiajs/react"
import HeroSection from "@/components/aboutUs/HeroSection"
import OurMission from "@/components/aboutUs/OurMission"
import Together from "@/components/aboutUs/Together"
import NonProfit from "@/components/aboutUs/NonProfit"
import QuoteSection from "@/components/reusable/QuoteSection"

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>Qui nous sommes</title>
        <meta name="description" content="Your page description" />
      </Head>
      <HeroSection />
      <OurMission />
      <Together />
      <NonProfit />
      <QuoteSection
        white={false}
        quote={
          <span>
            L'exemple n'est pas le meilleur moyen de convaincre,{"\n"}c'est le
            seul.
          </span>
        }
        author={<span>Albert Schweitzer</span>}
      />
    </>
  )
}
