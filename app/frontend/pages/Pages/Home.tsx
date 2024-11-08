import HeroSection from "../../components/home/HeroSection";
import CharitySection from "../../components/home/CharitySection";
import JoinUsSection from "../../components/home/JoinUsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CharitySection />
      <JoinUsSection />
      <div className="container mx-auto">Rest of the Homepage</div>
    </>
  );
}
