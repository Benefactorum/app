import { Head } from "@inertiajs/react";
import HeroSection from "../../components/cofounders/HeroSection";
import Members from "../../components/cofounders/Members";
import QuoteSection from "../../components/cofounders/QuoteSection";

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>Co-fondateurs</title>
        <meta name="description" content="Your page description" />
      </Head>
      <HeroSection />
      <Members />
      <QuoteSection />
    </>
  );
}
