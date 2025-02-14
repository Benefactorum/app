import { Head, useForm } from '@inertiajs/react'
import { ReactElement, useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import OsblHeader from '@/components/pages/contribution/new/OsblHeader'
import OsblDataSheet from '@/components/pages/contribution/new/OsblDatasheet'
import OsblFinance from '@/components/pages/contribution/new/OsblFinances'
import OsblDocuments from '@/components/pages/contribution/new/OsblDocuments'
import OsblLocations from '@/components/pages/contribution/new/OsblLocations'
import { CurrentUserType } from '@/types/types'
import { FormProps, NewOsbl, ContributionData, Contribution, OsblUpdate, FilesAsObject } from '@/pages/Contribution/types'
import z from 'zod'
import deepCleanData from '@/lib/deepCleanData'
import { toast } from 'sonner'
import ContributionDialog from '@/components/pages/contribution/new/ContributionDialog'
import getAllowedFormats from '@/lib/getAllowedFormats'
import { validate } from '@/lib/validate'
import { FormDataConvertible } from '@inertiajs/core'

type StrictForm<T> = T extends FormDataConvertible ? T :
  T extends Array<infer U> ? Array<StrictForm<U>> :
    T extends object ? { [K in keyof T]: StrictForm<T[K]> } :
      T

const MAX_LOGO_SIZE = 1 * 1024 * 1024 // 1MB
const ALLOWED_LOGO_TYPES = ['image/svg+xml', 'image/png', 'image/webp']
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024 // 5MB

const osblValidation = z.object({
  contribution: z.object({
    osbl: z.object({
      website: z.string().url({ message: 'Veuillez entrer une URL valide.' }).optional(),
      logo: z.instanceof(File)
        .refine((file) => file.size <= MAX_LOGO_SIZE, 'La taille du fichier doit être inférieure à 1 MB.')
        .refine((file) => ALLOWED_LOGO_TYPES.includes(file.type), `Le type de fichier est invalide. Format accepté : ${getAllowedFormats(ALLOWED_LOGO_TYPES)}.`)
        .optional(),
      osbls_causes_attributes: z.array(z.object({ cause_id: z.string() })).min(1, { message: 'Au moins une cause est requise.' }),
      tax_reduction: z.enum(['intérêt_général', 'aide_aux_personnes_en_difficulté'], { message: 'Veuillez sélectionner un pourcentage.' })
    })
  })
})

const contributionValidation = z.object({
  contribution: z.object({
    files: z.array(z.instanceof(File))
      .refine((files) => files.length <= 5, '5 fichiers maximum.')
      .refine((files) => files.every(file => file.size <= MAX_DOCUMENT_SIZE), 'La taille d\'un fichier ne peut excéder 5 MB.')
      .optional()
  })
})

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

function createOsblProxy (
  data: Contribution,
  setData: (key: string, value: any) => void,
  errors: Record<string, string>,
  clearErrors: (field: 'contribution') => void,
  setError: (field: 'contribution', message: string) => void
): FormProps {
  return {
    data: data.contribution.osbl,
    setData: (key, value) => {
      const updatedOsbl = {
        ...data.contribution?.osbl,
        [key]: value
      }

      setData('contribution', {
        ...data.contribution,
        osbl: updatedOsbl
      })
    },
    errors: Object.entries(errors).reduce<Record<string, string>>((acc, [key, value]) => {
      const match = key.match(/^contribution\.osbl\.(.+)/)
      if (match != null) {
        acc[match[1]] = value
      }
      return acc
    }, {}),
    clearErrors: (field: string) => clearErrors(`contribution.osbl.${field}` as 'contribution'),
    setError: (field, message) => setError(`contribution.osbl.${field}` as 'contribution', message)
  }
}

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
      body: contribution.body,
      files: contribution.files,
      osbl: initialOsbl
    }
  })

  const formProps = createOsblProxy(data, setData, errors, clearErrors, setError)

  const [showBottomButton, setShowBottomButton] = useState(false)
  const topButtonRef = useRef<HTMLButtonElement>(null)

  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBottomButton(!entry.isIntersecting)
      },
      { threshold: 1 }
    )

    if (topButtonRef.current != null) {
      observer.observe(topButtonRef.current)
    }

    return () => observer.disconnect()
  }, [])

  function setContributionField (field: keyof ContributionData, value: ContributionData[keyof ContributionData]): void {
    setData('contribution', {
      ...data.contribution,
      [field]: value
    })
  }

  function validateOsbl (): boolean {
    // Create a validation copy that ensures logo is a File or undefined
    const dataForValidation = {
      // ...data,
      contribution: {
        ...data.contribution,
        osbl: {
          ...data.contribution.osbl,
          logo: data.contribution.osbl.logo instanceof File ? data.contribution.osbl.logo : undefined
        }
      }
    }

    if (!validate(osblValidation, dataForValidation, setError)) {
      toast.error('Veuillez corriger les erreurs avant de continuer.')
      return false
    }
    return true
  }

  function validateContribution (): boolean {
    const dataForValidation = {
      contribution: {
        ...data.contribution,
        files: data.contribution.files instanceof Array
          ? data.contribution.files.filter((file): file is File => file instanceof File)
          : [] // If files is an object or undefined, use empty array for validation
      }
    }
    return validate(contributionValidation, dataForValidation, setError)
  }

  function validateAndOpenDialog (e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    if (!validateOsbl()) return
    setOpenDialog(true)
  }

  function handleConfirmSubmit (): void {
    if (!validateContribution()) return
    transform((data) => deepCleanData(data))
    put(`/users/${currentUser.id}/contributions/${String(contribution.id)}/`, {
      onError: (errors) => {
        Object.entries(errors).forEach(([key, value]) => {
          setError(`contribution.osbl.${key}` as 'contribution', value)
        })
        setOpenDialog(false)
        toast.error('Veuillez corriger les erreurs avant de continuer.')
      }
    }
    )
  }

  function avoidUnintentionalSubmission (e: React.KeyboardEvent<HTMLFormElement>): void {
    if (e.code === 'Enter') {
      e.preventDefault()
    }
  }

  return (
    <>
      <Head title='Ajouter une association' />

      <form
        onKeyDown={avoidUnintentionalSubmission}
        onSubmit={validateAndOpenDialog}
        className='2xl:container mx-auto flex flex-col px-2 sm:px-8 md:px-16 pt-8 pb-16 gap-8'
      >
        <div className='flex gap-8 sm:gap-16 items-center flex-wrap justify-center md:justify-start'>
          <h1 className='font-semibold text-2xl sm:text-3xl'>Ajouter une association</h1>
          <Button
            ref={topButtonRef}
            type='submit'
            className='text-lg'
          >
            <Save className='mr-2' />
            Enregistrer
          </Button>
        </div>

        <div className='flex flex-col pt-4 gap-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <OsblHeader {...formProps} />
            <OsblDataSheet {...formProps} />
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <OsblFinance {...formProps} />
            <OsblDocuments {...formProps} />
            <OsblLocations {...formProps} />
          </div>
        </div>
        {showBottomButton && (
          <Button
            type='submit'
            className='text-lg ml-auto mt-4 sm:mt-8'
          >
            <Save className='mr-2' />
            Enregistrer
          </Button>
        )}
      </form>

      <ContributionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        contribution={data.contribution as unknown as ContributionData}
        setContributionField={setContributionField}
        onConfirm={handleConfirmSubmit}
        error={errors['contribution.files' as 'contribution']}
        clearError={() => clearErrors('contribution.files' as 'contribution')}
        processing={processing}
      />
    </>
  )
}
