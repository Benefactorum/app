import { Head, useForm } from '@inertiajs/react'
import { ReactElement } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
// @ts-expect-error
import GoodIdea from '@/assets/icons/good-idea.svg?react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import OsblHeader from '@/components/pages/contribution/new/OsblHeader'
import OsblDataSheet from '@/components/pages/contribution/new/OsblDataSheet'
import OsblFinance from '@/components/pages/contribution/new/OsblFinance'
import OsblDocuments from '@/components/pages/contribution/new/OsblDocuments'
import OsblLocations from '@/components/pages/contribution/new/OsblLocations'
import { CurrentUserType } from '@/types/types'
import { FormData } from './types'
import z from 'zod'
import deepCleanData from '@/lib/deepCleanData'

const MAX_LOGO_SIZE = 1 * 1024 * 1024 // 1MB
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_LOGO_TYPES = ['image/svg', 'image/png', 'image/webp']
const ALLOWED_DOCUMENT_TYPES = ['application/pdf']

const validation = z.object({
  website: z.string().url({ message: 'Veuillez entrer une URL valide.' }).optional(),
  logo: z.instanceof(File)
    .refine((file) => {
      return file.size <= MAX_LOGO_SIZE
    }, 'La taille du fichier doit être inférieure à 1 MB.')
    .refine((file) => {
      return ALLOWED_LOGO_TYPES.includes(file.type)
    }, 'Le type de fichier est invalide. Format accepté : SVG, PNG, WEBP.')
    .optional(),
  description: z.string().max(300).optional(),
  osbls_causes_attributes: z.array(z.object({ cause_id: z.string() }), { message: 'Au moins une cause est requise.' }),
  contact_email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }).optional(),
  tax_reduction: z.enum(['intérêt_général', 'aide_aux_personnes_en_difficulté'], { message: 'La réduction d\'impôt accordée doit être de 66 % ou 75 %.' }),
  annual_finances_attributes: z.array(
    z.object({
      year: z.string({ message: 'Veuillez entrer une année.' })
        .regex(/^\d{4}$/, { message: 'L\'année doit contenir exactement 4 chiffres.' })
        .min(1, { message: 'Veuillez entrer une année.' })
        .refine((year) => {
          const yearNum = Number(year)
          return yearNum <= new Date().getFullYear()
        }, { message: 'L\'année ne peut pas être dans le futur.' }),
      certified: z.boolean().optional(),
      budget: z.string().optional(),
      treasury: z.string().optional(),
      employees_count: z.string().optional(),
      fund_sources_attributes: z.array(z.object({
        type: z.string(),
        percent: z.string().min(1)
          .refine((percent) => {
            const percentNum = Number(percent)
            return percentNum >= 0.01 && percentNum <= 100
          }, { message: 'Le pourcentage doit être compris entre 0.01 et 100.' }),
        amount: z.string().optional()
      })).optional()
        .refine((sources): sources is typeof sources => {
          if (sources === undefined || sources.length === 0) return true

          const sum = sources.reduce((acc: number, source) => {
            const percent = source.percent !== undefined ? Number(source.percent) : 0
            return acc + percent
          }, 0)
          return sum === 100
        }, {
          message: 'La somme des pourcentages doit être égale à 100%.',
          path: ['total_percent']
        }),
      fund_allocations_attributes: z.array(z.object({
        type: z.string(),
        percent: z.string().min(1)
          .refine((percent) => {
            const percentNum = Number(percent)
            return percentNum >= 0.01 && percentNum <= 100
          }, { message: 'Le pourcentage doit être compris entre 0.01 et 100.' }),
        amount: z.string().optional()
      })).optional()
        .refine((allocations): allocations is typeof allocations => {
          if (allocations === undefined || allocations.length === 0) return true

          const sum = allocations.reduce((acc: number, allocation) => {
            const percent = allocation.percent !== undefined ? Number(allocation.percent) : 0
            return acc + percent
          }, 0)
          return sum === 100
        }, {
          message: 'La somme des pourcentages doit être égale à 100%.',
          path: ['total_percent']
        })
    }).refine((finance) => {
      if (finance === undefined || Object.keys(finance).length === 0) return true
      // If only year is present, Object.keys will return length of 1
      // We want at least one other field besides year
      return !(Object.keys(finance).length === 1 && finance.year !== undefined)
    }, {
      message: 'Complétez les comptes pour cette année.',
      path: ['missing_information']
    })
  ).refine((finances) => {
    if (finances === undefined || finances.length === 0) return true
    const years = finances.map(f => f.year)
    return new Set(years).size === years.length
  }, {
    message: 'Une année ne peut être ajoutée qu\'une seule fois.',
    path: ['duplicate_years']
  }),
  document_attachments_attributes: z.array(z.object({
    document_attributes: z.object({
      file: z.instanceof(File)
        .refine((file) => {
          return file.size <= MAX_DOCUMENT_SIZE
        }, 'La taille du fichier doit être inférieure à 5 MB.')
        .refine((file) => {
          return ALLOWED_DOCUMENT_TYPES.includes(file.type)
        }, 'Le type de fichier est invalide. Format accepté : PDF.')
    })
  })).optional()
})

export default function New ({ currentUser }: { currentUser: CurrentUserType }): ReactElement {
  const { data, setData, post, processing, errors, clearErrors, setError, transform } = useForm<FormData>({
    name: '',
    osbls_causes_attributes: [],
    tax_reduction: ''
  })

  function submit (e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()

    transform((data) => (deepCleanData(data)))
    // const result = validation.safeParse(data) as { success: boolean, error: z.ZodError }
    const result = validation.safeParse(deepCleanData(data)) as { success: boolean, error: z.ZodError }
    if (!result.success) {
      const issues = result.error.issues
      issues.forEach(issue => {
        setError(issue.path.join('.') as keyof FormData, issue.message)
      })
      return
    }

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

      <form onKeyDown={avoidUnintentionalSubmission} onSubmit={submit} className='2xl:container mx-auto flex flex-col px-2 sm:px-8 md:px-16 pt-8 pb-16 gap-8'>
        <div className='flex gap-16 items-center flex-wrap justify-center md:justify-start'>
          <h1 className='font-semibold text-3xl'>Ajouter une association</h1>
          <Button type='submit' disabled={processing} className='text-lg'>
            <Save className='mr-2' />
            Enregistrer
          </Button>
        </div>
        {/* <Alert>
          <GoodIdea className='min-w-8 min-h-8' />
          <AlertDescription>
            Pour que votre contribution soit validée, le modérateur doit pouvoir
            vérifier les informations fournies. Facilitez son travail en
            indiquant clairement vos sources !
          </AlertDescription>
        </Alert> */}

        <div className='flex flex-col pt-4 gap-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <OsblHeader data={data} setData={setData} errors={errors} clearErrors={clearErrors} />
            <OsblDataSheet data={data} setData={setData} errors={errors} clearErrors={clearErrors} />
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <OsblFinance data={data} setData={setData} errors={errors} clearErrors={clearErrors} setError={(field, message) => setError(field as keyof FormData, message)} />
            <OsblDocuments data={data} setData={setData} errors={errors} clearErrors={clearErrors} />
            <OsblLocations data={data} setData={setData} />
          </div>
        </div>
      </form>
    </>
  )
}
