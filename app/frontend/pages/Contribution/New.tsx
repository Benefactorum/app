import { Head, useForm } from '@inertiajs/react'
import { ReactElement } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
// @ts-expect-error
import GoodIdea from '@/assets/icons/good-idea.svg?react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import OsblHeader from '@/components/pages/contribution/new/OsblHeader'
import OsblDataSheet from '@/components/pages/contribution/new/OsblDataSheet'
import { CurrentUserType } from '@/types/types'
import { FormData } from './types'
import z from 'zod'
interface NewProps {
  currentUser: CurrentUserType
  causes: Array<[string, number]>
}

const validation = z.object({
  website: z.string().url({ message: 'Veuillez entrer une URL valide.' }).optional(),
  description: z.string().max(300).optional(),
  osbls_causes_attributes: z.array(z.object({ cause_id: z.string() })).min(1, { message: 'Au moins une cause est requise.' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }).optional(),
  tax_reduction: z.enum(['standard', 'aide_aux_personnes_en_difficulté'], { message: 'La réduction d’impôt accordée doit être de 66 % ou 75 %.' })
})

export default function New ({ currentUser }: NewProps): ReactElement {
  const { data, setData, post, processing, errors, clearErrors, setError } = useForm<FormData>({
    name: '',
    website: undefined,
    logo: undefined,
    description: '',
    osbls_causes_attributes: [],
    tax_reduction: undefined,
    osbls_keywords_attributes: [],
    geographical_scale: undefined,
    osbls_intervention_areas_attributes: [],
    employees_count: undefined,
    osbl_type: undefined,
    creation_year: undefined,
    contact_email: undefined
  })

  function submit (e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()

    const result = validation.safeParse(data) as { success: boolean, error: z.ZodError }
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

      <div className='2xl:container mx-auto flex flex-col px-2 sm:px-8 md:px-16 pt-8 pb-16 gap-8'>
        <h1 className='font-semibold text-3xl'>Ajouter une association</h1>
        <Alert>
          <GoodIdea className='min-w-8 min-h-8' />
          <AlertDescription>
            Pour que votre contribution soit validée, le modérateur doit pouvoir
            vérifier les informations fournies. Facilitez son travail en
            indiquant clairement vos sources !
          </AlertDescription>
        </Alert>

        <form onKeyDown={avoidUnintentionalSubmission} onSubmit={submit} className='flex flex-col pt-4 gap-16'>
          <Button type='submit' disabled={processing} className='mx-auto'>
            <Save />
            Enregistrer
          </Button>
          <OsblHeader data={data} setData={setData} errors={errors} clearErrors={clearErrors} />
          <OsblDataSheet data={data} setData={setData} errors={errors} clearErrors={clearErrors} />
          <Button type='submit' disabled={processing} className='mx-auto'>
            <Save />
            Enregistrer
          </Button>
        </form>
      </div>
    </>
  )
}
