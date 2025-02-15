import { useForm } from '@inertiajs/react'
import { ReactElement } from 'react'
import { CurrentUserType } from '@/types/types'
import { Contribution, NewOsbl, OsblUpdate, FilesAsObject } from '@/pages/Contribution/types'
import Form from '@/pages/Contribution/Form'
import { toast } from 'sonner'
import { FormDataConvertible } from '@inertiajs/core'

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

function getOsblData (osbl: OsblUpdate): NewOsbl {
  return {
    ...osbl,
    public_utility: Boolean(osbl.public_utility),
    osbls_causes_attributes: Object.values(osbl.osbls_causes_attributes),
    osbls_keywords_attributes: (osbl.osbls_keywords_attributes !== undefined)
      ? Object.values(osbl.osbls_keywords_attributes)
      : undefined,
    osbls_intervention_areas_attributes: (osbl.osbls_intervention_areas_attributes !== undefined)
      ? Object.values(osbl.osbls_intervention_areas_attributes)
      : undefined,
    osbls_labels_attributes: (osbl.osbls_labels_attributes !== undefined)
      ? Object.values(osbl.osbls_labels_attributes).map(label => ({
        label_id: label.label_id,
        name: label.name ?? '' // Ensure name is always a string
      }))
      : undefined,
    annual_finances_attributes: (osbl.annual_finances_attributes !== undefined)
      ? Object.values(osbl.annual_finances_attributes).map(finance => ({
        year: Number(finance.year),
        budget: finance.budget !== '' && finance.budget !== undefined ? Number(finance.budget) : undefined,
        treasury: finance.treasury !== '' && finance.treasury !== undefined ? Number(finance.treasury) : undefined,
        employees_count: finance.employees_count !== '' && finance.employees_count !== undefined ? Number(finance.employees_count) : undefined,
        certified: Boolean(finance.certified),
        fund_sources_attributes: (finance.fund_sources_attributes !== undefined)
          ? Object.values(finance.fund_sources_attributes).map(source => ({
            type: source.type,
            percent: Number(source.percent),
            amount: source.amount !== undefined ? Number(source.amount) : undefined
          }))
          : undefined,
        fund_allocations_attributes: (finance.fund_allocations_attributes !== undefined)
          ? Object.values(finance.fund_allocations_attributes).map(allocation => ({
            type: allocation.type,
            percent: Number(allocation.percent),
            amount: allocation.amount !== undefined ? Number(allocation.amount) : undefined
          }))
          : undefined
      }))
      : undefined,
    document_attachments_attributes: (osbl.document_attachments_attributes !== undefined)
      ? Object.values(osbl.document_attachments_attributes)
      : undefined,
    locations_attributes: (osbl.locations_attributes !== undefined)
      ? Object.values(osbl.locations_attributes)
      : undefined
  }
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
    put(`/users/${currentUser.id}/contributions/${String(contribution.id)}/`, {
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
