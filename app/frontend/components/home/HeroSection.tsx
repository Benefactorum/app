import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// import { router } from "@inertiajs/react";
import PovertyImage from "/assets/images/homepage/hero_section/home-hero-left-top.webp";
import EcologyImage from "/assets/images/homepage/hero_section/home-hero-left-middle.webp";
import CommunityImage from "/assets/images/homepage/hero_section/home-hero-left-bottom.webp";
import AnimalImage from "/assets/images/homepage/hero_section/home-hero-right-top.webp";
import MedicalImage from "/assets/images/homepage/hero_section/home-hero-right-middle.webp";
import ChildrenImage from "/assets/images/homepage/hero_section/home-hero-right-bottom.webp";

export default function HeroSection() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputValue = (form.elements[0] as HTMLInputElement).value;
    alert(inputValue);
    // router.get("", inputValue.value);
  }

  return (
    <div className="2xl:container 2xl:mx-auto relative flex flex-col justify-center items-center overflow-x-hidden p-2">
      <img
        src={PovertyImage}
        alt="Un jeune homme offre de l'eau à une personne âgée allongée sur le sol, illustrant un geste de compassion et de solidarité envers les plus vulnérables"
        className="border-2 border-secondary rounded-3xl absolute top-8 -left-24 sm:inset-1/2 sm:transform sm:-translate-x-[24rem] sm:-translate-y-64 md:-translate-x-[30rem] md:-translate-y-64 "
      />
      <img
        src={MedicalImage}
        alt="Un soignant déguisé en super-héros, avec une cape rouge et un masque, illustrant la force, le dévouement et la joie indispensables pour accompagner et favoriser la guérison"
        className="border-2 border-secondary rounded-3xl z-10 absolute inset-1/2 transform max-[367px]:-translate-y-80 -translate-x-20 -translate-y-[19rem] sm:-translate-y-[19rem] md:-translate-x-28 md:-translate-y-[22rem] xl:inset-auto xl:translate-x-0 xl:translate-y-0 xl:bottom-52 xl:right-7 "
      />
      <img
        src={AnimalImage}
        alt="Un chien noir avec un ruban rouge autour du cou, regardant attentivement à travers les barreaux d'un enclos, symbolisant l'espoir et l'attente d'une nouvelle famille dans un refuge"
        className="border-2 border-secondary rounded-3xl absolute top-6 sm:top-20 -right-24 md:top-20 md:-right-20 lg:inset-1/2 lg:transform lg:translate-x-64 lg:-translate-y-80 xl:-translate-y-80"
      />
      <img
        src={EcologyImage}
        alt="Mains tenant délicatement un cœur de mousse verte et de feuilles, symbolisant le soin de la nature et la conscience environnementale"
        className="border-2 border-secondary rounded-3xl absolute -right-28 bottom-4 sm:bottom-12 md:inset-1/2 md:transform md:-translate-x-[32rem] md:translate-y-11 lg:inset-auto lg:translate-x-0 lg:translate-y-0 lg:bottom-24 lg:left-0"
      />
      <img
        src={CommunityImage}
        alt="Un groupe de bénévoles nettoie un trottoir en s'amusant, symbolisant l'entraide et la bonne humeur dans les actions communautaires"
        className="z-10 border-2 border-secondary rounded-3xl absolute inset-1/2 transform -translate-x-16 max-[367px]:translate-y-24 translate-y-20 sm:translate-y-28 md:translate-x-4 md:translate-y-40 lg:inset-auto lg:translate-x-0 lg:translate-y-0 lg:bottom-6 lg:left-[28rem]"
      />
      <img
        src={ChildrenImage}
        alt="Un groupe d'enfants et d'adultes assiste avec émerveillement à un spectacle de marionnettes, illustrant le pouvoir rassembleur de l'art et de la culture"
        className="border-2 border-secondary rounded-3xl absolute max-[367px]:bottom-7 -left-24 bottom-6 sm:bottom-24 md:inset-1/2 md:transform md:translate-x-52 md:translate-y-24"
      />
      {/* Main content */}
      <div className="bg-white mt-32 mb-44 sm:mt-32 sm:mb-36 md:mt-36 md:mb-40 lg:mt-32 xl:mt-16  p-8 md:p-16 rounded-2xl flex flex-col gap-8 z-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold whitespace-pre-line">
          <span className="leading-snug">
            Vous pouvez faire{"\n"} la différence,{"\n"}ici et maintenant
          </span>
        </h1>
        <h2 className="sm:text-xl md:text-2xl whitespace-pre-line">
          Trouvez et soutenez les associations{"\n"} qui défendent vos valeurs.
        </h2>
        <form onSubmit={handleSubmit} className="flex items-center">
          <Input
            type="search"
            title="Rechercher une association ou une cause"
            placeholder="Rechercher une association ou une cause"
            className="bg-white w-full h-11 rounded-none rounded-l-lg focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:placeholder-transparent border-r-0 focus-visible:ring-offset-0"
          />
          <Button type="submit" size="lg" className="rounded-none rounded-r-lg">
            <Search />
          </Button>
        </form>
      </div>
    </div>
  );
}
