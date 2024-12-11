import { Head, Link } from '@inertiajs/react'
import Form from './Form'
import { ContributionType } from './types'

interface EditProps {
  contribution: ContributionType
}

export default function Edit ({ contribution }: EditProps) {
  return (
    <>
      <Head title='Editing contribution' />

      <div className='mx-auto md:w-2/3 w-full px-8 pt-8'>
        <h1 className='font-bold text-4xl'>Editing contribution</h1>

        <Form
          contribution={contribution}
          onSubmit={(form) => {
            form.transform((data) => ({ contribution: data }))
            form.patch(`/contributions/${contribution.id}`)
          }}
          submitText='Update Contribution'
        />

        <Link
          href={`/contributions/${contribution.id}`}
          className='ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium'
        >
          Show this contribution
        </Link>
        <Link
          href='/contributions'
          className='ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium'
        >
          Back to contributions
        </Link>
      </div>
    </>
  )
}
