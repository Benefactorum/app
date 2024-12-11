import { Button } from '@/components/ui/button'
import { Link, usePage } from '@inertiajs/react'
// @ts-expect-error
import LeftQuote from '@/assets/images/homepage/quote/left-quote.svg?react'
// @ts-expect-error
import RightQuote from '@/assets/images/homepage/quote/right-quote.svg?react'
import { ReactElement, FC } from 'react'

interface QuoteSectionProps {
  quote: ReactElement
  author: ReactElement
  white?: boolean
}

const excludedPatterns = [/^\/connexion$/, /^\/se-connecter$/, /^\/s-inscrire$/]

const QuoteSection: FC<QuoteSectionProps> = ({
  quote,
  author,
  white = true
}) => {
  const { url } = usePage()
  const isExcluded = excludedPatterns.some((pattern) => pattern.test(url))

  return (
    <div
      className={
        (white ? 'bg-white ' : '') +
        'flex-grow w-full mx-auto my flex flex-col items-center justify-center gap-16 py-16 px-4'
      }
    >
      <blockquote className='relative flex flex-col px-10 text-lg sm:text-xl md:text-2xl gap-2 whitespace-pre-line text-center'>
        <LeftQuote className='absolute -top-2 left-0' />
        {quote}
        <RightQuote className='absolute -top-2 right-0' />
        <cite className='block text-sm sm:text-base md:text-lg ml-auto'>
          -- {author} --
        </cite>
      </blockquote>
      {!isExcluded && (
        <Link href='/connexion'>
          <Button variant='secondary' size='xl'>
            S'inscrire
          </Button>
        </Link>
      )}
    </div>
  )
}

export default QuoteSection
