import { Head, useForm } from '@inertiajs/react'
import { ReactElement } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
// @ts-expect-error
import GoodIdea from '@/assets/icons/good-idea.svg?react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import OsblHeader from '@/components/pages/contribution/new/OsblHeader'
import OsblDataSheet from '@/components/pages/contribution/new/OsblDatasheet'
import OsblFinance from '@/components/pages/contribution/new/OsblFinances'
import OsblDocuments from '@/components/pages/contribution/new/OsblDocuments'
import OsblLocations from '@/components/pages/contribution/new/OsblLocations'
import { CurrentUserType } from '@/types/types'
import { FormData } from './types'
import z from 'zod'
import deepCleanData from '@/lib/deepCleanData'
import { toast } from 'sonner'

const MAX_LOGO_SIZE = 1 * 1024 * 1024 // 1MB
const ALLOWED_LOGO_TYPES = ['image/svg', 'image/png', 'image/webp']

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
  osbls_causes_attributes: z.array(z.object({ cause_id: z.string() })).min(1, { message: 'Au moins une cause est requise.' }),
  tax_reduction: z.enum(['intérêt_général', 'aide_aux_personnes_en_difficulté'], { message: 'Veuillez sélectionner un pourcentage.' })
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
    const result = validation.safeParse(data) as { success: boolean, error: z.ZodError }
    if (!result.success) {
      const issues = result.error.issues
      issues.forEach(issue => {
        setError(issue.path.join('.') as keyof FormData, issue.message)
      })

      toast.error('Veuillez corriger les erreurs avant de continuer.')
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
        <div className='flex gap-8 sm:gap-16 items-center flex-wrap justify-center md:justify-start'>
          <h1 className='font-semibold text-2xl sm:text-3xl'>Ajouter une association</h1>
          <Button type='submit' disabled={processing} className='text-lg'>
            <Save className='mr-2' />
            Enregistrer
          </Button>
        </div>
        <Alert>
          <GoodIdea className='min-w-8 min-h-8' />
          <AlertDescription>
            Pour que votre contribution soit validée, le modérateur doit pouvoir
            vérifier les informations fournies. Facilitez son travail en
            indiquant clairement vos sources !
          </AlertDescription>
        </Alert>

        <div className='flex flex-col pt-4 gap-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <OsblHeader data={data} setData={setData} errors={errors} clearErrors={clearErrors} />
            <OsblDataSheet data={data} setData={setData} errors={errors} clearErrors={clearErrors} />
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <OsblFinance data={data} setData={setData} errors={errors} clearErrors={clearErrors} setError={(field, message) => setError(field as keyof FormData, message)} />
            <OsblDocuments data={data} setData={setData} errors={errors} clearErrors={clearErrors} setError={(field, message) => setError(field as keyof FormData, message)} />
            <OsblLocations data={data} setData={setData} />
          </div>
        </div>
        <Button type='submit' disabled={processing} className='text-lg ml-auto mt-4 sm:mt-8'>
          <Save className='mr-2' />
          Enregistrer
        </Button>
      </form>
    </>
  )
}
