import TogethernessLogo from "/assets/images/aboutUs/togetherness.svg";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "@inertiajs/react";
import { buttonVariants } from "@/components/ui/button";

const imageDescription =
  "Icône représentant deux silhouettes féminines se tenant côte à côte, symbolisant la solidarité, l'unité et le soutien mutuel";

export default function Together() {
  return (
    <div className="flex flex-col md:flex-row py-8 lg:py-16 2xl:container mx-auto px-2 sm:px-8 gap-8 lg:gap-16">
      <div className="flex flex-grow xl:flex-none md:w-2/3 flex-col justify-center gap-8">
        <h2 className=" text-xl sm:text-2xl lg:text-3xl whitespace-pre-line font-semibold">
          <span className="leading-snug">
            Toi + Moi + Eux + Tous ceux qui le veulent
          </span>
        </h2>
        <div className="flex md:hidden my-4 mx-auto">
          <div className="w-[120px]">
            <AspectRatio ratio={177.59 / 200}>
              <img
                src={TogethernessLogo}
                alt={imageDescription}
                title={imageDescription}
              />
            </AspectRatio>
          </div>
        </div>
        <p>
          Benefactorum est un projet militant, créé par des donateurs ... pour
          des donateurs.
        </p>
        <p>
          Benefactorum est un projet ouvert à toutes les bonnes volontés. La
          plateforme est <span className="italic">open source</span>, son
          contenu est participatif, sa gouvernance est horizontale.
        </p>
        <div className="flex flex-wrap justify-end md:justify-start items-center gap-y-4 gap-x-8">
          <Link
            href="/nous-rejoindre"
            className={`${buttonVariants({
              variant: "",
              size: "lg",
            })}`}
          >
            Nous rejoindre
          </Link>
          <Link href="/co-fondateurs" className="underline hover:text-primary">
            Voir l’équipe de co-fondateurs
          </Link>
        </div>
      </div>
      <div className="hidden md:flex md:w-1/3 justify-center items-center">
        <div className="w-[177.59px]">
          <AspectRatio ratio={177.59 / 200}>
            <img
              src={TogethernessLogo}
              alt={imageDescription}
              title={imageDescription}
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  );
}
