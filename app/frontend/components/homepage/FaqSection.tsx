import { Link } from "@inertiajs/react"
import { buttonVariants } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Faq from "/assets/images/homepage/faq.webp"

const imageDescription =
  "Illustration d'un livre ouvert avec un cœur au centre et une loupe à côté, symbolisant le guide du donateur"

export default function JoinUs() {
  return (
    <div className="bg-white">
      <div className="py-16 2xl:container mx-auto px-2 sm:px-4">
        <h2 className="mb-8 text-xl sm:text-2xl md:text-3xl font-semibold">
          Consultez notre guide du donateur
        </h2>
        <div className="px-2 sm:px-4 flex gap-8 sm:flex-row flex-col justify-center">
          <div className="flex md:w-1/3 lg:w-5/12 xl:w-1/2 justify-center items-center">
            <div className="w-[164px] md:w-[328px]">
              <AspectRatio ratio={328 / 321}>
                <img
                  src={Faq}
                  alt={imageDescription}
                  title={imageDescription}
                  className="rounded-full"
                />
              </AspectRatio>
            </div>
          </div>
          <div className="max-w-[632px] flex flex-col justify-center space-y-8">
            <h3 className="text-lg sm:text-xl md:text-2xl leading-normal font-semibold">
              Pour vous aider à donner en toute sérénité, Benefactorum répond à
              toutes vos questions.
            </h3>
            <ul className="pl-4 sm:pl-8 list-disc flex flex-col space-y-4">
              <li className="underline hover:text-primary">
                <Link href="/">
                  C’est quoi une association d’intérêt général ?
                </Link>
              </li>
              <li className="underline hover:text-primary">
                <Link href="/">Pourquoi donner ?</Link>
              </li>
              <li className="underline hover:text-primary">
                <Link href="/">Qu'est-ce-qu'une réduction d’impôt ?</Link>
              </li>
              <li className="underline hover:text-primary">
                <Link href="/">À qui donner ?</Link>
              </li>
            </ul>
            <div className="ml-auto">
              <Link
                href=""
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
    </div>
  )
}
