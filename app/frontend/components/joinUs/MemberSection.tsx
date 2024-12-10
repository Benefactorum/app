import Member from "/assets/images/joinUs/adherent.webp"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Link } from "@inertiajs/react"
import { buttonVariants } from "@/components/ui/button"
import { Vote } from "lucide-react"

const imageDescription =
  "Icône représentant une main insérant un bulletin de vote dans une urne, entourée de figures humaines levant la main, symbolisant la participation démocratique, le vote et l'engagement citoyen."

export default function Together() {
  return (
    <div className="flex flex-col md:flex-row py-8 lg:py-16 2xl:container mx-auto px-2 sm:px-8 gap-8 lg:gap-16">
      <div className="flex flex-grow xl:flex-none md:w-2/3 flex-col justify-center gap-8">
        <h2 className=" text-xl sm:text-2xl lg:text-3xl whitespace-pre-line font-semibold">
          <span className="leading-snug">Devenir adhérent de Benefactorum</span>
        </h2>
        <div className="flex md:hidden my-4 mx-auto">
          <div className="w-[150px]">
            <AspectRatio ratio={253.88 / 300}>
              <img
                src={Member}
                alt={imageDescription}
                title={imageDescription}
              />
            </AspectRatio>
          </div>
        </div>
        <p>
          Benefactorum offre aux donateurs et aux associations bénéficiaires la
          possibilité de participer activement à sa gouvernance.
        </p>
        <p>
          En tant qu'adhérent de l'association Benefactorum, vous avez
          l'opportunité de prendre part aux assemblées générales et
          d'influencer, par vos votes, les orientations et les décisions de
          l'organisation. C'est une manière concrète de faire vivre la
          démocratie au sein de Benefactorum.
        </p>
        <div className="flex flex-wrap justify-end md:justify-start items-center gap-y-4 gap-x-8">
          <Link
            disabled
            href=""
            className={`${buttonVariants({
              mode: "disabled",
              size: "lg",
            })}`}
          >
            <Vote />
            Adhérer
          </Link>
          <a
            href="Statuts-Benefactorum.pdf"
            target="_blank"
            className="underline hover:text-primary"
          >
            Lire nos statuts
          </a>
        </div>
      </div>
      <div className="hidden md:flex md:w-1/3 justify-center items-center">
        <div className="w-[253.88px]">
          <AspectRatio ratio={253.88 / 300}>
            <img src={Member} alt={imageDescription} title={imageDescription} />
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}
