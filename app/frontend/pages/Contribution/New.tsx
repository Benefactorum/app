import { useForm } from '@inertiajs/react'
import { ReactElement } from 'react'
import { CurrentUserType } from '@/types/types'
import { Contribution } from '@/pages/Contribution/types'
import Form from '@/pages/Contribution/Form'
import { toast } from 'sonner'
import { FormDataConvertible } from '@inertiajs/core'

type StrictForm<T> = T extends FormDataConvertible ? T :
  T extends Array<infer U> ? Array<StrictForm<U>> :
    T extends object ? { [K in keyof T]: StrictForm<T[K]> } :
      T

export default function New ({ currentUser }: { currentUser: CurrentUserType }): ReactElement {
  const { data, setData, post, processing, errors, clearErrors, setError, transform } = useForm<StrictForm<Contribution>>({
    contribution: {
      osbl: {
        name: '',
        osbls_causes_attributes: [],
        tax_reduction: '' as 'intérêt_général' | 'aide_aux_personnes_en_difficulté'
      }
    }
  })

  function handleSubmit (): void {
    post(`/users/${currentUser.id}/contributions`, {
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
      title='Ajouter une association'
    />
  )
}
