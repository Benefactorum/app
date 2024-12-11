import { Head, Link } from '@inertiajs/react'
import Contribution from './Contribution'
import { ContributionType } from './types'

interface ShowProps {
  contribution: ContributionType
  flash: { notice?: string }
}

export default function Show ({ contribution, flash }: ShowProps) {
  return (
    <>
      <Head title={`Contribution #${contribution.id}`} />

      <div className='mx-auto md:w-2/3 w-full px-8 pt-8'>
        <div className='mx-auto'>
          {flash.notice && (
            <p className='py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block'>
              {flash.notice}
            </p>
          )}

          <h1 className='font-bold text-4xl'>
            Contribution #{contribution.id}
          </h1>

          <Contribution contribution={contribution} />

          <Link
            href={`/contributions/${contribution.id}/edit`}
            className='mt-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium'
          >
            Edit this contribution
          </Link>
          <Link
            href='/contributions'
            className='ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium'
          >
            Back to contributions
          </Link>
          <div className='inline-block ml-2'>
            <Link
              href={`/contributions/${contribution.id}`}
              as='button'
              method='delete'
              className='mt-2 rounded-lg py-3 px-5 bg-gray-100 font-medium'
            >
              Destroy this contribution
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
