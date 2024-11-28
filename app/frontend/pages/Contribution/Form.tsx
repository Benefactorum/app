import { useForm } from '@inertiajs/react'

export default function Form({ contribution, onSubmit, submitText }) {
  const form = useForm({
    user_id: contribution.user_id || '',
    status: contribution.status || '',
    contributable_id: contribution.contributable_id || '',
  })
  const { data, setData, errors, processing } = form

  const handleSubmit = (e) => {
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
        {errors.user_id && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.user_id.join(', ')}
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
          onChange={(e) => setData('status', e.target.value)}
        />
        {errors.status && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.status.join(', ')}
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
        {errors.contributable_id && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.contributable_id.join(', ')}
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
