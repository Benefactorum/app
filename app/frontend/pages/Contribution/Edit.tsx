import { useForm } from '@inertiajs/react'
import { ReactElement } from 'react'
import { CurrentUserType } from '@/types/types'
import { Contribution, NewOsbl, OsblUpdate, FilesAsObject } from '@/pages/Contribution/types'
import Form from '@/pages/Contribution/Form'
import { toast } from 'sonner'
import { FormDataConvertible } from '@inertiajs/core'
import { getOsblData } from '@/lib/osblData'

type StrictForm<T> = T extends FormDataConvertible ? T :
  T extends Array<infer U> ? Array<StrictForm<U>> :
    T extends object ? { [K in keyof T]: StrictForm<T[K]> } :
      T

export interface ContributionToEdit {
  id: number
  body?: string
  files?: FilesAsObject
  osbl: OsblUpdate
}

export default function Edit ({ currentUser, contribution }: { currentUser: CurrentUserType, contribution: ContributionToEdit }): ReactElement {
  const initialOsbl: NewOsbl = getOsblData(contribution.osbl)
  const { data, setData, put, processing, errors, clearErrors, setError, transform } = useForm<StrictForm<Contribution>>({
    contribution: {
      body: contribution.body !== null ? contribution.body : undefined,
      files: contribution.files,
      osbl: initialOsbl
    }
  })

  function handleSubmit (): void {
    put(`/users/${currentUser.id}/contributions/${contribution.id}/`, {
      onError: (errors) => {
        Object.entries(errors).forEach(([key, value]) => {
          setError(`contribution.osbl.${key}` as 'contribution', value)
        })
        toast.error('Veuillez corriger les erreurs avant de continuer.')
      }
    })
  }

  return (
    <Form
      data={data}
      setData={setData}
      errors={errors}
      clearErrors={clearErrors}
      setError={setError}
      transform={transform}
      processing={processing}
      onSubmit={handleSubmit}
      title='Modifier une association'
    />
  )
}
