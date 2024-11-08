import HeroSection from "../../components/home/HeroSection";
import CharitySection from "../../components/home/CharitySection";
import JoinUsSection from "../../components/home/JoinUsSection";
import FaqSection from "../../components/home/FaqSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CharitySection />
      <JoinUsSection />
      <FaqSection />
      <div className="container mx-auto">Rest of the Homepage</div>
    </>
  );
}
