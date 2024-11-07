import HeroSection from "../../components/home/HeroSection";
import CharitySection from "../../components/home/CharitySection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CharitySection />
      <div className="container mx-auto">Rest of the Homepage</div>
    </>
  );
}
