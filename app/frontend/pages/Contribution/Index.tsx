import { Head } from "@inertiajs/react"
import { Fragment } from "react"
import { ContributionType } from "./types"
import { CurrentUserType } from "@/pages/types"

interface IndexProps {
  currentUser: CurrentUserType
  contributions: ContributionType[]
}

export default function Index({ currentUser, contributions }: IndexProps) {
  return (
    <>
      <Head title="Mes contributions" />
      <div className="">
        {/* <div className="flex justify-between items-center">
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
        </div> */}
      </div>
    </>
  )
}
