import { Head, Link } from '@inertiajs/react'
import { Fragment } from 'react'
import Contribution from './Contribution'
import { ContributionType } from './types'

interface IndexProps {
  contributions: ContributionType[]
  flash: { notice?: string }
}

export default function Index({ currentUser, contributions, flash }: IndexProps) {
  return (
    <>
      <Head title="Contributions" />
      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        {flash.notice && (
          <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
            {flash.notice}
          </p>
        )}
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl">Contributions</h1>
          <Link
            href={`/users/${currentUser.id}/contributions/new`}
            className="rounded-lg py-3 px-5 bg-blue-600 text-white block font-medium"
          >
            New contribution
          </Link>
        </div>

        <div className="min-w-full">
          {contributions.map((contribution) => (
            <Fragment key={contribution.id}>
              <Contribution contribution={contribution} />
              <p>
                <Link
                  href={`/contributions/${contribution.id}`}
                  className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
                >
                  Show this contribution
                </Link>
              </p>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
