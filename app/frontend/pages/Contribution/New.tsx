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
import { OsblCreationData, FormProps, OsblData, ContributionData } from '@/pages/Contribution/types'
import z from 'zod'
import deepCleanData from '@/lib/deepCleanData'
import { toast } from 'sonner'
import ContributionDialog from '@/components/pages/contribution/new/ContributionDialog'
import getAllowedFormats from '@/lib/getAllowedFormats'
import { validate } from '@/lib/validate'

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

function createOsblProxy (
  data: Partial<OsblCreationData>,
  setData: (key: string, value: any) => void,
  errors: Record<string, string>,
  clearErrors: (field: 'contribution') => void,
  setError: (field: 'contribution', message: string) => void
): FormProps {
  return {
    data: data.contribution?.osbl as OsblData,
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

export default function New ({ currentUser }: { currentUser: CurrentUserType }): ReactElement {
  // inertia types don't handle nested data properly.
  const { data, setData, post, processing, errors, clearErrors, setError, transform } = useForm({
    contribution: {
      body: '',
      files: [],
      osbl: {
        name: '',
        osbls_causes_attributes: [],
        tax_reduction: ''
      }
    }
  })

  // Create a proxy for the form props
  const formProps = createOsblProxy(data as Partial<OsblCreationData>, setData, errors, clearErrors, setError)

  // Add state for button visibility
  const [showBottomButton, setShowBottomButton] = useState(false)
  const topButtonRef = useRef<HTMLButtonElement>(null)

  // New: State to control dialog open/close
  const [openDialog, setOpenDialog] = useState(false)

  // Add intersection observer
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

  // Add a helper function to update contribution fields (body and files)
  function setContributionField (field: keyof OsblCreationData['contribution'], value: OsblCreationData['contribution'][keyof OsblCreationData['contribution']]): void {
    setData('contribution', {
      ...data.contribution,
      [field]: value
    })
  }

  function validateOsbl (): boolean {
    if (!validate(osblValidation, data as unknown as OsblCreationData, setError)) {
      toast.error('Veuillez corriger les erreurs avant de continuer.')
      return false
    }
    return true
  }

  function validateContribution (): boolean {
    return validate(contributionValidation, data, setError)
  }

  // Updated submit functions using the helpers

  function validateAndOpenDialog (e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    if (!validateOsbl()) return
    setOpenDialog(true)
  }

  function handleConfirmSubmit (): void {
    if (!validateContribution()) return
    transform((data) => deepCleanData(data))
    post(`/users/${currentUser.id}/contributions`)
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
