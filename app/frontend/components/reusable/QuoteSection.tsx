import { Button } from "@/components/ui/button";
import SignInModal from "@/components/reusable/SignInModal";
// @ts-ignore
import LeftQuote from "/assets/images/homepage/quote/left-quote.svg?react";
// @ts-ignore
import RightQuote from "/assets/images/homepage/quote/right-quote.svg?react";
import { ReactElement, FC } from "react";

interface QuoteSectionProps {
  quote: ReactElement;
  author: ReactElement;
  white?: boolean;
}

const QuoteSection: FC<QuoteSectionProps> = ({
  quote,
  author,
  white = true,
}) => {
  return (
    <div
      className={
        (white ? `bg-white` : "") +
        `mx-auto flex flex-col items-center py-16 px-4`
      }
    >
      <blockquote className="relative flex flex-col px-10 mb-16 text-lg sm:text-xl md:text-2xl gap-2 whitespace-pre-line text-center">
        <LeftQuote className="absolute -top-2 left-0" />
        {quote}
        <RightQuote className="absolute -top-2 right-0" />
        <cite className="block text-sm sm:text-base md:text-lg ml-auto">
          -- {author} --
        </cite>
      </blockquote>
      <SignInModal>
        <Button variant="secondary" size="xl">
          S'inscrire
        </Button>
      </SignInModal>
    </div>
  );
};

export default QuoteSection;
