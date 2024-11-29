import { useForm } from '@inertiajs/react'
import { FormEvent } from 'react'
import { ContributionFormType, ContributionType } from './types'

// Temporary fix for InertiaFormProps not being exported from @inertiajs/react
type InertiaFormProps<TForm extends Record<string, any>> = ReturnType<typeof useForm<TForm>>

interface FormProps {
  contribution: ContributionType
  onSubmit: (form: InertiaFormProps<ContributionFormType>) => void
  submitText: string
}

export default function Form({ contribution, onSubmit, submitText }: FormProps) {
  const form = useForm<ContributionFormType>({
    user_id: contribution.user_id,
    status: contribution.status,
    contributable_id: contribution.contributable_id,
  })
  const { data, setData, errors, processing } = form

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="contents">
      <div className="my-5">
        <label htmlFor="user">User</label>
        <input
          type="text"
          name="user"
          id="user"
          value={data.user_id}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) => setData('user_id', e.target.value)}
        />
        {errors.user && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.user}
          </div>
        )}
      </div>

      <div className="my-5">
        <label htmlFor="status">Status</label>
        <input
          type="number"
          name="status"
          id="status"
          value={data.status}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) => setData('status', parseInt(e.target.value))}
        />
        {errors.status && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.status}
          </div>
        )}
      </div>

      <div className="my-5">
        <label htmlFor="contributable">Contributable</label>
        <input
          type="text"
          name="contributable"
          id="contributable"
          value={data.contributable_id}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) => setData('contributable_id', e.target.value)}
        />
        {errors.contributable && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.contributable}
          </div>
        )}
      </div>

      <div className="inline">
        <button
          type="submit"
          disabled={processing}
          className="rounded-lg py-3 px-5 bg-blue-600 text-white inline-block font-medium cursor-pointer"
        >
          {submitText}
        </button>
      </div>
    </form>
  )
}
