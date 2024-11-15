import HeroSection from "../../components/homepage/HeroSection";
import CharitySection from "../../components/homepage/CharitySection";
import JoinUsSection from "../../components/homepage/JoinUsSection";
import FaqSection from "../../components/homepage/FaqSection";
import QuoteSection from "../../components/reusable/QuoteSection";
// @ts-ignore
import Smiley from "/assets/images/homepage/quote/smiley.svg?react";

export default function Home() {
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
            <Smiley className="inline-block ml-2 w-6 h-6 mb-1" />
          </span>
        }
      />
    </>
  );
}
