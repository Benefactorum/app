import BenefactorumLogo from "/assets/images/aboutUs/benefactorum.svg";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const imageDescription =
  "Logo de Benefactorum, représentant deux mains qui se donnent, dans un labyrinthe";

export default function HeroSection() {
  return (
    <div className="flex flex-col sm:flex-row mx-auto py-16 2xl:container mx-auto px-4 lg:px-16 gap-8">
      <div className="flex sm:w-1/2 flex-col justify-center">
        <h1 className="mb-8 sm:mb-16 text-center sm:text-left text-2xl sm:text-3xl md:text-4xl whitespace-pre-line">
          <span className="leading-snug">
            Vous prenez soin des autres ?{"\n"}
            On prend soin de <span className="font-semibold">vous !</span>
          </span>
        </h1>
        <h2 className="text-center sm:text-left sm:text-xl md:text-2xl">
          Découvrez Benefactorum, l’organisation d’intérêt général qui facilite
          la vie des donateurs !
        </h2>
      </div>
      <div className="flex sm:w-1/2 justify-center items-center">
        <div className="w-[200px] sm:w-[400px]">
          <AspectRatio ratio={1}>
            <img
              src={BenefactorumLogo}
              alt={imageDescription}
              title={imageDescription}
              className="rounded-3xl"
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  );
}
