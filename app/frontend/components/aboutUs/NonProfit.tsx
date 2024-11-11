import HeartAssoLogo from "/assets/images/aboutUs/heart-asso.svg";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "@inertiajs/react";
import { buttonVariants } from "@/components/ui/button";

const imageDescription =
  "Icône d'un cœur stylisé, symbolisant l'engagement associatif, la solidarité et le soutien communautaire.";

export default function NonProfit() {
  return (
    <div className="bg-white">
      <div className="flex flex-col-reverse md:flex-row py-8 lg:py-16 2xl:container mx-auto px-2 sm:px-8 gap-8 lg:gap-16">
        <div className="flex md:w-1/3 justify-center items-center">
          <div className="w-[200px] lg:w-[300px]">
            <AspectRatio ratio={1}>
              <img
                src={HeartAssoLogo}
                alt={imageDescription}
                title={imageDescription}
              />
            </AspectRatio>
          </div>
        </div>
        <div className="flex flex-grow xl:flex-none md:w-2/3 flex-col justify-center gap-8">
          <h2 className=" text-xl sm:text-2xl lg:text-3xl whitespace-pre-line font-semibold">
            <span className="leading-snug">
              Une gestion désintéressée et transparente
            </span>
          </h2>
          <p className="">
            Benefactorum est une organisation à but non-lucratif, animée à 100%
            par des bénévoles.
          </p>
          <p className="">
            Benefactorum est une organisation d’intérêt général, et peut
            recevoir des dons, ce qui constitue l’unique source de financement
            de la plateforme.
          </p>
          <p className="">
            Les comptes de Benefactorum sont publics et contrôlés par un
            commissaire aux comptes.
          </p>
          <div className="flex justify-end">
            <Link
              href="/nous-rejoindre"
              className={`${buttonVariants({
                variant: "",
                size: "lg",
              })}`}
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}