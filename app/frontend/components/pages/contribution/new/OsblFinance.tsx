import React, { ReactElement } from 'react'
import { FormProps, AnnualFinance } from '@/pages/Contribution/types'
import MyNumberInput from '@/components/forms/MyNumberInput'
import HelpTooltip from '@/components/shared/HelpTooltip'
import FundManagementSection from './FundManagementSection'
import MyCheckbox from '@/components/forms/MyCheckbox'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const FundSourceTypeList = [
  { value: 'dons', label: 'Dons', group: 'main' },
  { value: 'aides_publiques', label: 'Aides publiques', group: 'main' },
  { value: 'revenus_d_activites', label: 'Revenus d\'activités', group: 'main' },
  { value: 'autre', label: 'Autre', group: 'main' }
  // { value: 'dons_des_particuliers', label: 'Dons des particuliers', group: 'detailed' },
  // { value: 'mécénat', label: 'Mécénat d\'entreprises', group: 'detailed' },
  // { value: 'fonds_dédiés', label: 'Reprise sur fonds dédiés', group: 'detailed' },
  // { value: 'activité_commerciale', label: 'Activité commerciale', group: 'detailed' }
]

const FundAllocationTypeList = [
  { value: 'missions_sociales', label: 'Missions sociales', group: 'main' },
  { value: 'frais_de_fonctionnement', label: 'Frais de fonctionnement', group: 'main' },
  { value: 'frais_de_recherche_de_fonds', label: 'Frais de recherche de fonds', group: 'main' },
  { value: 'autre', label: 'Autre', group: 'main' }
]

export default function OsblFinance ({ data, setData, errors, clearErrors }: FormProps): ReactElement {
  const finances = data.annual_finances_attributes ?? []

  function updateFinanceAttribute (index: number, attribute: keyof AnnualFinance, value: any): void {
    const updatedFinances = finances.map((finance, i) =>
      i === index
        ? {
            ...finance,
            [attribute]: value
          }
        : finance
    )

    setData('annual_finances_attributes', updatedFinances)

    // Je rentre une information, je veux que le message d'erreur soit supprimé
    if (attribute !== 'year' && value !== '') {
      clearErrors(`annual_finances_attributes.${index}.missing_information`)
    }
  }

  function handleFinanceAdd (e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    setData('annual_finances_attributes', [...finances, {}])
  }

  function handleFinanceRemove (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ): void {
    e.preventDefault()
    const updatedFinances = finances.filter((_, i) => i !== index)
    setData('annual_finances_attributes', updatedFinances)

    clearErrors(`annual_finances_attributes.${index}.missing_information`)
    clearErrors(`annual_finances_attributes.${index}.fund_sources_attributes.total_percent`)
  }

  return (
    <div className='bg-white rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col w-full h-full'>
      <div className='flex items-center gap-4 justify-between flex-wrap'>
        <h2 className='text-2xl font-semibold w-[145px]'>Comptes</h2>
        <Button onClick={handleFinanceAdd} variant='outline'>
          <PlusIcon className='w-4 h-4' />
          <span className='ml-2 hidden sm:block lg:hidden xl:block'>Ajouter</span>
        </Button>
      </div>

      {finances.length > 0 && (
        <div className='flex flex-col gap-4'>
          {finances.map((finance, index) => (
            <Card
              key={`finance-${index}`}
              className='bg-background'
            >
              <CardHeader className='flex flex-row items-center pb-2'>
                <div className='ml-auto'>
                  <Button
                    onClick={(e) => handleFinanceRemove(e, index)}
                    variant='ghost'
                    className='text-red-500 hover:text-red-700 p-0 h-auto'
                  >
                    <TrashIcon className='w-4 h-4' />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className='flex flex-col gap-8'>
                <MyNumberInput
                  id={`year-${index}`}
                  labelText={
                    <>
                      Année *
                      <HelpTooltip size='small' className='mx-2'>
                        <p>Année du bilan comptable.</p>
                        <p>Si à cheval sur deux ans, entrez la dernière année.</p>
                      </HelpTooltip>
                      :
                    </>
                  }
                  min={1000}
                  max={new Date().getFullYear()}
                  placeholder={String(new Date().getFullYear() - 1)}
                  value={finance.year ?? ''}
                  onChange={(e) => updateFinanceAttribute(index, 'year', e.target.value)}
                  required
                  error={errors[`annual_finances_attributes.${index}.missing_information`]}
                />

                <MyCheckbox
                  id={`certified-${index}`}
                  checked={finance.certified ?? false}
                  onCheckedChange={(checked) => updateFinanceAttribute(index, 'certified', checked)}
                >
                  <div className='flex items-center'>
                    Comptes certifiés
                    <HelpTooltip className='ml-2'>
                      Un commissaire aux comptes a validé la comptabilité de l'OSBL.
                    </HelpTooltip>
                  </div>
                </MyCheckbox>

                <MyNumberInput
                  id={`budget-${index}`}
                  labelText='Budget'
                  min={0}
                  step={0.01}
                  value={finance.budget ?? ''}
                  onChange={(e) => updateFinanceAttribute(index, 'budget', e.target.value)}
                  suffix='€'
                />

                <MyNumberInput
                  id={`treasury-${index}`}
                  labelText='Trésorerie'
                  step={0.01}
                  value={finance.treasury ?? ''}
                  onChange={(e) => updateFinanceAttribute(index, 'treasury', e.target.value)}
                  suffix='€'
                />

                <FundManagementSection
                  title='Sources de financement'
                  items={finance.fund_sources_attributes ?? []}
                  typeList={FundSourceTypeList}
                  baseErrorPath={`annual_finances_attributes.${index}.fund_sources_attributes`}
                  errors={errors}
                  onUpdate={(items) => updateFinanceAttribute(index, 'fund_sources_attributes', items)}
                  clearErrors={clearErrors}
                />

                <FundManagementSection
                  title='Allocation des fonds'
                  items={finance.fund_allocations_attributes ?? []}
                  typeList={FundAllocationTypeList}
                  baseErrorPath={`annual_finances_attributes.${index}.fund_allocations_attributes`}
                  errors={errors}
                  onUpdate={(items) => updateFinanceAttribute(index, 'fund_allocations_attributes', items)}
                  clearErrors={clearErrors}
                />

                <Separator />

                <MyNumberInput
                  id={`employees_count-${index}`}
                  labelText="Nombre d'employé"
                  min={0}
                  value={finance.employees_count ?? ''}
                  onChange={(e) => updateFinanceAttribute(index, 'employees_count', e.target.value)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
