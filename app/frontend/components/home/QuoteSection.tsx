import { buttonVariants } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

import LeftQuote from "/assets/images/homepage/quote/left-quote.svg";
import RightQuote from "/assets/images/homepage/quote/right-quote.svg";
import Smiley from "/assets/images/homepage/quote/smiley.webp";

export default function QuoteSection() {
  return (
    <div className="mx-auto flex flex-col items-center py-16 px-4">
      <blockquote className="relative flex flex-col px-10 mb-16 text-lg sm:text-xl md:text-2xl gap-2">
        <img
          src={LeftQuote}
          alt="Ouvrez les guillements"
          className="absolute -top-2 left-0"
        />
        Grâce à Benefactorum, je me sens plus heureux !
        <img
          src={RightQuote}
          alt="Fermez les guillements"
          className="absolute -top-2 right-0"
        />
        <cite className="block text-sm sm:text-base md:text-lg ml-auto">
          -- Vous, une fois inscrit
          <img
            src={Smiley}
            alt="Ouvrez les guillements"
            className="ml-2 inline-block"
          />
          --
        </cite>
      </blockquote>
      <Link
        href="/posts"
        className={`${buttonVariants({
          variant: "secondary",
          size: "xl",
        })}`}
      >
        S'inscrire
      </Link>
    </div>
  );
}
