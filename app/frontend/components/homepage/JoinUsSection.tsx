import { Link } from "@inertiajs/react";
import { buttonVariants } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Altogether from "/assets/images/homepage/altogether.webp";

const imageDescription =
  "Illustration de personnes de divers horizons unies pour le bien commun, participant à des activités simples comme planter des arbres, partager de la nourriture et interagir avec bienveillance, symbolisant la solidarité et l'engagement communautaire";

export default function JoinUs() {
  return (
    <div className="py-16 2xl:container mx-auto px-4">
      <h2 className="mb-8 text-xl sm:text-2xl md:text-3xl font-semibold">
        Rejoignez Benefactorum !
      </h2>
      <div className="px-2 sm:px-4 flex gap-8 md:flex-row flex-col-reverse">
        <div className="flex flex-1 flex-col justify-center space-y-8">
          <h3 className="text-lg sm:text-xl md:text-2xl leading-normal font-semibold">
            Benefactorum est le moteur de recherche de ceux qui veulent
            contribuer au bien commun.
          </h3>
          <ul className="pl-4 sm:pl-8 list-disc flex flex-col space-y-4">
            <li className="leading-normal">
              Benefactorum est la première initiative citoyenne pour référencer{" "}
              <span className="font-semibold">
                toutes les associations d’intérêt général
              </span>{" "}
              françaises.
            </li>
            <li className="leading-normal">
              Benefactorum est une plateforme{" "}
              <span className="italic">open source</span>, participative et
              démocratique. Son utilisation est{" "}
              <span className="font-semibold">100% gratuite</span>.
            </li>
            <li className="leading-normal">
              <span className="font-semibold">
                Benefactorum est elle-même une association d’intérêt général
              </span>
              . Sa mission est de promouvoir l’altruisme, la générosité et la
              solidarité.
            </li>
          </ul>
          <div>
            <Link
              href="/qui-nous-sommes"
              className={`${buttonVariants({
                variant: "secondary",
                size: "lg",
              })}`}
            >
              En savoir plus
            </Link>
          </div>
        </div>
        <div className="flex md:w-1/3 lg:w-5/12 xl:w-1/2 justify-center items-center">
          <div className="w-[304px] lg:w-[575px]">
            <AspectRatio ratio={575 / 329}>
              <img
                src={Altogether}
                alt={imageDescription}
                title={imageDescription}
                className="rounded-3xl"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </div>
  );
}
