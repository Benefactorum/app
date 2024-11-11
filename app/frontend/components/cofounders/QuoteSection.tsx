import { buttonVariants } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
// @ts-ignore
import LeftQuote from "/assets/images/homepage/quote/left-quote.svg?react";
// @ts-ignore
import RightQuote from "/assets/images/homepage/quote/right-quote.svg?react";

export default function QuoteSection() {
  return (
    <div className="mx-auto flex flex-col items-center py-16 px-4">
      <blockquote className="relative flex flex-col px-10 mb-16 text-lg sm:text-xl md:text-2xl gap-2 whitespace-pre-line text-center">
        <LeftQuote className="absolute -top-2 left-0" />
        Personne n'est jamais devenu pauvre en donnant.
        <RightQuote className="absolute -top-2 right-0" />
        <cite className="block text-sm sm:text-base md:text-lg ml-auto">
          -- Anne Frank --
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
