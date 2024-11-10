import BrainHeartLogo from "/assets/images/aboutUs/brain-heart.svg";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const imageDescription =
  "Logo de Benefactorum, représentant deux mains qui se donnent, dans un labyrinthe";

export default function OurMission() {
  return (
    <div className="bg-white">
      <div className="flex flex-col-reverse md:flex-row py-8 lg:py-16 2xl:container mx-auto px-2 sm:px-8 gap-8 lg:gap-16">
        <div className="flex md:w-1/3 justify-center items-center">
          <div className="w-[200px] lg:w-[300px]">
            <AspectRatio ratio={1}>
              <img
                src={BrainHeartLogo}
                alt={imageDescription}
                title={imageDescription}
              />
            </AspectRatio>
          </div>
        </div>
        <div className="flex flex-grow xl:flex-none md:w-2/3 flex-col justify-center gap-8">
          <h2 className=" text-xl sm:text-2xl lg:text-3xl whitespace-pre-line font-semibold">
            <span className="leading-snug">
              Notre mission : donner envie de donner
            </span>
          </h2>
          <p className="">
            Benefactorum est né d’un constat simple :{" "}
            <span className="font-semibold">
              6 Français sur 10 souhaiteraient donner davantage
            </span>
            . Pourtant, des obstacles persistent, et beaucoup trouvent le don
            trop complexe.
          </p>
          <p className="">
            Nous avons fondé Benefactorum avec une conviction : ces obstacles,
            nous pouvons les surmonter. Imaginez un monde où donner est aussi
            impactant que gratifiant, où chaque geste de générosité est facilité
            en toute confiance.
          </p>
          <p className="">
            Benefactorum est animé par un espoir : libérer le potentiel
            altruiste de nos utilisateurs, et ensemble, contribuer à un monde
            meilleur.
          </p>
        </div>
      </div>
    </div>
  );
}
