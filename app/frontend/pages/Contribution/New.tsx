import { Head, Link } from '@inertiajs/react'
import Form from './Form'
import { ContributionType } from './types'

interface NewProps {
  contribution: ContributionType
}

export default function New({ currentUser, contribution }: NewProps) {
  return (
    <>
      <Head title="New contribution" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">New contribution</h1>

        <Form
          contribution={contribution}
          onSubmit={(form) => {
            form.transform((data) => ({ contribution: data }))
            form.post(`/users/${currentUser.id}/contributions`)
          }}
          submitText="Create Contribution"
        />

        <Link
          href="/mes-contributions"
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Back to contributions
        </Link>
      </div>
    </>
  )
}
