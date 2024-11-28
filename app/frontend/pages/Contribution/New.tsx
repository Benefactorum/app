import { Link, Head } from '@inertiajs/react'
import Form from './Form'

export default function New({ contribution }) {
  return (
    <>
      <Head title="New contribution" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">New contribution</h1>

        <Form
          contribution={contribution}
          onSubmit={(form) => {
            form.transform((data) => ({ contribution: data }))
            form.post('/contributions')
          }}
          submitText="Create contribution"
        />

        <Link
          href="/contributions"
          className="ml-2 rounded-lg py-3 px-5 bg-gray-100 inline-block font-medium"
        >
          Back to contributions
        </Link>
      </div>
    </>
  )
}
