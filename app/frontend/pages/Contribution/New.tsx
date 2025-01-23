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
import { CurrentUserType } from '@/types/types'
import { FormData } from './types'
import z from 'zod'
import deepCleanData from '@/lib/deepCleanData'
interface NewProps {
  currentUser: CurrentUserType
  causes: Record<string, number>
}

const validation = z.object({
  website: z.string().url({ message: 'Veuillez entrer une URL valide.' }).optional(),
  description: z.string().max(300).optional(),
  osbls_causes_attributes: z.array(z.object({ cause_id: z.string() })).min(1, { message: 'Au moins une cause est requise.' }),
  contact_email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }).optional(),
  tax_reduction: z.enum(['intérêt_général', 'aide_aux_personnes_en_difficulté'], { message: 'La réduction d\'impôt accordée doit être de 66 % ou 75 %.' }),
  annual_finances_attributes: z.array(z.object({
    year: z.string({ message: 'Veuillez entrer une année.' }).min(1, { message: 'Veuillez entrer une année.' }),
    budget: z.string().optional(),
    treasury: z.string().optional(),
    employees_count: z.string().optional(),
    fund_sources_attributes: z.array(z.object({
      type: z.string(),
      percent: z.string().min(1),
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
      percent: z.string().min(1),
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
  }).refine((data): data is typeof data => {
    if (Object.values(data).filter(v => v.length > 0).length === 1 && data.year !== '') {
      return false
    }
    return true
  }, {
    message: 'Complétez les comptes pour cette année.',
    path: ['missing_information']
  })).optional()
})

export default function New ({ currentUser }: NewProps): ReactElement {
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
          <OsblFinance
            data={data}
            setData={setData}
            errors={errors}
            clearErrors={clearErrors}
            setError={(field, message) => setError(field as keyof FormData, message)}
          />
          <Button type='submit' disabled={processing} className='mx-auto'>
            <Save />
            Enregistrer
          </Button>
        </form>
      </div>
    </>
  )
}
