import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// import { router } from "@inertiajs/react";
import PovertyImage from "/assets/images/home-hero-left-top.png";
import EcologyImage from "/assets/images/home-hero-left-middle2.png";
import CommunityImage from "/assets/images/home-hero-left-bottom.png";
import AnimalImage from "/assets/images/home-hero-right-top.png";
import MedicalImage from "/assets/images/home-hero-right-middle.png";
import ChildrenImage from "/assets/images/home-hero-right-bottom.png";

export default function HeroSection() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputValue = (form.elements[0] as HTMLInputElement).value;
    alert(inputValue);
    // router.get("", inputValue.value);
  }

  return (
    <div className="sm:h-auto 2xl:container 2xl:mx-auto relative flex flex-col justify-center items-center">
      <div className="flex gap-4 my-4">
        <img
          src={PovertyImage}
          alt="Un jeune homme offre de l'eau à une personne âgée allongée sur le sol, illustrant un geste de compassion et de solidarité envers les plus vulnérables"
          className="max-h-[100px] sm:max-h-max sm:absolute sm:inset-1/2 sm:transform sm:-translate-x-[24rem] sm:-translate-y-64 md:-translate-x-[30rem] md:-translate-y-64 "
        />
        <img
          src={MedicalImage}
          alt="Un soignant déguisé en super-héros, avec une cape rouge et un masque, illustrant la force, le dévouement et la joie indispensables pour accompagner et favoriser la guérison"
          className="max-h-[100px] sm:max-h-max sm:absolute sm:inset-1/2 sm:transform sm:-translate-x-20 sm:-translate-y-72 md:-translate-x-28 md:-translate-y-80 xl:inset-auto xl:translate-x-0 xl:translate-y-0 xl:bottom-52 xl:right-7 "
        />
        <img
          src={AnimalImage}
          alt="Un chien noir avec un ruban rouge autour du cou, regardant attentivement à travers les barreaux d'un enclos, symbolisant l'espoir et l'attente d'une nouvelle famille dans un refuge"
          className="max-h-[100px] sm:max-h-max sm:absolute sm:top-20 sm:-right-24 md:top-24 md:-right-20 lg:inset-1/2 lg:transform lg:translate-x-64 lg:-translate-y-64 xl:-translate-y-80"
        />
      </div>
      {/* Main content */}
      <div className="bg-white sm:my-36 p-8 md:p-16 rounded-2xl flex flex-col gap-8 z-10">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-semibold whitespace-pre-line">
          <span className="leading-snug">
            Vous pouvez faire{"\n"} la différence,{"\n"}ici et maintenant
          </span>
        </h1>
        <h2 className="tex-xl sm:text-xl md:text-2xl whitespace-pre-line">
          Trouvez et soutenez les associations{"\n"} qui défendent vos valeurs.
        </h2>
        <form onSubmit={handleSubmit} className="flex items-center">
          <Input
            type="search"
            title="Rechercher une association ou une cause"
            placeholder="Rechercher une association ou une cause"
            className="bg-white w-full h-11 rounded-none rounded-l-lg focus-visible:ring-0 focus-visible:border-primary focus-visible:placeholder-transparent border-r-0 focus-visible:ring-offset-0"
          />
          <Button type="submit" size="lg" className="rounded-none rounded-r-lg">
            <Search />
          </Button>
        </form>
      </div>
      <div className="flex gap-4 my-4">
        <img
          src={EcologyImage}
          alt="Mains tenant délicatement un cœur de mousse verte et de feuilles, symbolisant le soin de la nature et la conscience environnementale"
          className="max-h-[100px] sm:max-h-max sm:absolute sm:-right-28 sm:bottom-12 md:inset-1/2 md:transform md:-translate-x-[32rem] md:translate-y-11 lg:inset-auto lg:translate-x-0 lg:translate-y-0 lg:bottom-24 lg:left-0"
        />
        <img
          src={CommunityImage}
          alt="Un groupe de bénévoles nettoie un trottoir en s'amusant, symbolisant l'entraide et la bonne humeur dans les actions communautaires"
          className="max-h-[100px] sm:max-h-max sm:absolute sm:bottom-4 sm:left-52 md:inset-1/2 md:transform md:translate-x-4 md:translate-y-44 lg:inset-auto lg:translate-x-0 lg:translate-y-0 lg:bottom-0 lg:left-[28rem]"
        />
        <img
          src={ChildrenImage}
          alt="Un groupe d'enfants et d'adultes assiste avec émerveillement à un spectacle de marionnettes, illustrant le pouvoir rassembleur de l'art et de la culture"
          className="max-h-[100px] sm:max-h-max sm:absolute sm:-left-28 sm:bottom-28 md:inset-1/2 md:transform md:translate-x-52 md:translate-y-24"
        />
      </div>
    </div>
  );
}
<Search />;
