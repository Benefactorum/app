import Moderator from "/assets/images/joinUs/moderateur.webp"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Link } from "@inertiajs/react"
import { buttonVariants } from "@/components/ui/button"
import { MonitorCheck } from "lucide-react"

const imageDescription =
  "Icône représentant un écran d'ordinateur avec une interface de gestion et un utilisateur en bas, symbolisant le rôle de modération, de contrôle et d'administration en ligne."

export default function OurMission() {
  return (
    <div className="bg-white">
      <div className="flex flex-col-reverse md:flex-row py-8 lg:py-16 2xl:container mx-auto px-2 sm:px-8 gap-8 lg:gap-16">
        <div className="hidden md:flex md:w-1/3 justify-center items-center">
          <div className="w-[200px] lg:w-[300px]">
            <AspectRatio ratio={300 / 256.82}>
              <img
                src={Moderator}
                alt={imageDescription}
                title={imageDescription}
              />
            </AspectRatio>
          </div>
        </div>
        <div className="flex flex-grow xl:flex-none md:w-2/3 flex-col justify-center gap-8">
          <h2 className=" text-xl sm:text-2xl lg:text-3xl whitespace-pre-line font-semibold">
            <span className="leading-snug">
              Devenir modérateur pour Benefactorum
            </span>
          </h2>
          <div className="md:hidden flex my-4 mx-auto">
            <div className="w-[180px]">
              <AspectRatio ratio={300 / 256.82}>
                <img
                  src={Moderator}
                  alt={imageDescription}
                  title={imageDescription}
                />
              </AspectRatio>
            </div>
          </div>
          <p>
            Benefactorum est un projet ouvert à toutes les bonnes volontés. Son
            contenu est participatif.
          </p>
          <p>
            Pour garantir une qualité optimale du contenu sur Benefactorum, nous
            avons besoin de modérateurs. Leur mission : valider les nouvelles
            contributions ou suggérer des modifications.
          </p>
          <div className="flex justify-end">
            <a
              href="mailto:contact@benefactorum.org?subject=Candidature:%20Devenir%20mod%C3%A9rateur"
              className={`${buttonVariants({
                variant: "secondary",
                size: "lg",
              })}`}
            >
              <MonitorCheck />
              Devenir modérateur
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
