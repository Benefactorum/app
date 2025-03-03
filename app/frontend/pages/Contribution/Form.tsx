import { ReactElement, useState, useRef, useEffect } from 'react'
import { Head, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Save, Bot, Loader2 } from 'lucide-react'
import OsblHeader from '@/components/pages/contribution/new/OsblHeader'
import OsblDataSheet from '@/components/pages/contribution/new/OsblDatasheet'
import OsblFinance from '@/components/pages/contribution/new/OsblFinances'
import OsblDocuments from '@/components/pages/contribution/new/OsblDocuments'
import OsblLocations from '@/components/pages/contribution/new/OsblLocations'
import { Contribution, FormProps, ContributionData } from '@/pages/Contribution/types'
import z from 'zod'
import { toast } from 'sonner'
import ContributionDialog from '@/components/pages/contribution/new/ContributionDialog'
import getAllowedFormats from '@/lib/getAllowedFormats'
import { validate } from '@/lib/validate'
import deepCleanData from '@/lib/deepCleanData'
import HelpTooltip from '@/components/shared/HelpTooltip'
import axios from 'axios'

const MAX_LOGO_SIZE = 1 * 1024 * 1024 // 1MB
const ALLOWED_LOGO_TYPES = ['image/svg+xml', 'image/png', 'image/webp']
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024 // 5MB

const osblValidation = z.object({
  contribution: z.object({
    osbl: z.object({
      website: z.string()
        .transform(val => val === '' ? undefined : val)
        .pipe(z.string().url({ message: 'Veuillez entrer une URL valide.' }).optional()).optional(),
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

const ScraperValidation = z.object({
  contribution: z.object({
    osbl: z.object({
      website: z.string({ message: 'Champs requis' }).url({ message: 'Veuillez entrer une URL valide.' })
    })
  })
})

interface FormComponentProps {
  data: Contribution
  setData: (key: string, value: any) => void
  errors: Record<string, string>
  clearErrors: (field: 'contribution') => void
  setError: (field: 'contribution', message: string) => void
  transform: (callback: (data: Contribution) => Contribution) => void
  processing: boolean
  onSubmit: () => void
  title?: string
}

interface OsblImportResponse {
  status: string
  contribution_id: number | undefined
}

export default function Form ({
  data,
  setData,
  errors,
  clearErrors,
  setError,
  transform,
  processing,
  onSubmit,
  title = 'Ajouter une association'
}: FormComponentProps): ReactElement {
  const [showBottomButton, setShowBottomButton] = useState(false)
  const [importId, setImportId] = useState<string | null>(null)
  const topButtonRef = useRef<HTMLButtonElement>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const pollStatus = async (importId: string): Promise<void> => {
    try {
      const response = await fetch(`/osbl_imports/${importId}`)
      const { status, contribution_id } = await response.json() as OsblImportResponse

      if (status === 'completed' && contribution_id !== undefined) {
        router.get(`/mes-contributions/${contribution_id}/modifier`)
      } else if (status === 'extracted') {
        setTimeout(() => { void pollStatus(importId) }, 1000)
      } else if (status === 'initialized') {
        setTimeout(() => { void pollStatus(importId) }, 5000)
      } else {
        setImportId(null)
        toast.error('Une erreur est survenue lors de l\'extraction. Veuillez réessayer.')
      }
    } catch (error) {
      setImportId(null)
      toast.error('Une erreur est survenue lors de l\'extraction. Veuillez réessayer.')
    }
  }

  const formProps: FormProps = {
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
    const dataForValidation = {
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
        files: Array.isArray(data.contribution.files)
          ? data.contribution.files.filter((file): file is File => file instanceof File)
          : [] // If files is an object or undefined, use empty array for validation
      }
    }
    return validate(contributionValidation, dataForValidation, setError)
  }

  function validateAndOpenDialog (e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    if (!validateOsbl() || importId !== null) return
    setOpenDialog(true)
  }

  function handleConfirmSubmit (): void {
    if (!validateContribution()) return
    transform((data) => deepCleanData(data))
    onSubmit()
  }

  function avoidUnintentionalSubmission (e: React.KeyboardEvent<HTMLFormElement>): void {
    if (e.code === 'Enter') {
      e.preventDefault()
    }
  }

  function launchAutoScraper (): void {
    if (!validate(ScraperValidation, data as { contribution: { osbl: { website: string } } }, setError)) return

    void (async () => {
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        const response = await axios.post(
          '/osbl_imports',
          { osbl_uri: data.contribution.osbl.website },
          {
            headers: {
              'X-CSRF-Token': csrfToken
            }
          }
        )

        if (response.status !== 201) {
          throw new Error('Network response was not 201')
        } else {
          toast.success('Extraction lancée avec succès. Veuillez patienter quelques secondes.')
          setImportId(response.data.id)
          void pollStatus(response.data.id)
        }
      } catch (error) {
        toast.error('Une erreur est survenue lors de l\'extraction. Veuillez réessayer.')
      }
    })()
  }

  return (
    <>
      <Head title={title} />

      <form
        onKeyDown={avoidUnintentionalSubmission}
        onSubmit={validateAndOpenDialog}
        className='2xl:container mx-auto flex flex-col px-2 sm:px-8 md:px-16 pt-8 pb-16 gap-8'
      >
        <div className='flex gap-8 sm:gap-16 items-center flex-wrap justify-center md:justify-start'>
          <h1 className='font-semibold text-2xl sm:text-3xl'>{title}</h1>
          <div className='flex gap-8'>
            <Button
              ref={topButtonRef}
              type='submit'
              className='text-lg'
            >
              <Save className='mr-2' />
              Enregistrer
            </Button>

            <Button
              variant='outline'
              className='items-center'
              onClick={(e) => {
                e.preventDefault()
                launchAutoScraper()
              }}
              disabled={importId !== null}
            >
              {importId !== null
                ? <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                : <Bot className='mr-2' />}
              {importId !== null
                ? 'Extraction en cours...'
                : 'Saisie automatique'}
              <HelpTooltip>
                Automatise la collecte des informations de l'association depuis son site web.
              </HelpTooltip>
            </Button>
          </div>
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
        contribution={data.contribution}
        setContributionField={setContributionField}
        onConfirm={handleConfirmSubmit}
        error={errors['contribution.files' as 'contribution']}
        clearError={() => clearErrors('contribution.files' as 'contribution')}
        processing={processing}
      />
    </>
  )
}
