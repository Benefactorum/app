import HeroSection from "../../components/homepage/HeroSection";
import CharitySection from "../../components/homepage/CharitySection";
import JoinUsSection from "../../components/homepage/JoinUsSection";
import FaqSection from "../../components/homepage/FaqSection";
import QuoteSection from "../../components/reusable/QuoteSection";
import Smiley from "/assets/images/homepage/quote/smiley.webp";

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
            <img
              src={Smiley}
              alt="Smiley avec un grand sourire"
              className="ml-2 inline-block pb-1"
            />
          </span>
        }
      />
    </>
  );
}
