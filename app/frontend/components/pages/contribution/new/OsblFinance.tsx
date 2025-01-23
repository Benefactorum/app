import { ReactElement } from 'react'
import { FormProps, AnnualFinance } from '@/pages/Contribution/types'
import MyNumberInput from '@/components/forms/MyNumberInput'
import HelpTooltip from '@/components/shared/HelpTooltip'
import FundManagementSection from './FundManagementSection'
import MyCheckbox from '@/components/forms/MyCheckbox'
import { Separator } from '@/components/ui/separator'

const FundSourceTypeList = [
  { value: 'dons', label: 'Dons', group: 'main' },
  { value: 'aides_publiques', label: 'Aides publiques', group: 'main' },
  { value: 'revenus_d_activités', label: 'Revenus d\'activités', group: 'main' },
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

export default function OsblFinance ({ data, setData, errors, clearErrors, setError }: FormProps & { setError: (field: string, message: string) => void }): ReactElement {
  const currentFinance = (data.annual_finances_attributes?.[0] ?? {})

  function updateFinanceAttribute (attribute: keyof AnnualFinance, value: any): void {
    const shouldReset = Object.values(currentFinance).filter(v => v !== '').length <= 1 && (value.length === 0)

    setData('annual_finances_attributes', shouldReset
      ? []
      : [{
          ...currentFinance,
          [attribute]: value
        }])

    // Je rentre une information, je veux que le message d'erreur soit supprimé
    if (attribute !== 'year' && value !== '') {
      clearErrors('annual_finances_attributes.0.missing_information')
    }

    // Je rentre une année, je veux que le message d'erreur soit supprimé
    if (attribute === 'year' && value !== '') {
      clearErrors('annual_finances_attributes.0.year')
    }

    // Je reset tout, je veux que les messages d'erreur soient supprimés
    if (shouldReset) {
      clearErrors('annual_finances_attributes.0.year')
      clearErrors('annual_finances_attributes.0.missing_information')
      clearErrors('annual_finances_attributes.0.fund_sources_attributes.total_percent')
    }
  }

  return (
    <div className='flex flex-wrap gap-16 mx-auto justify-center'>
      <div className='bg-white w-full sm:w-auto rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col'>
        <h2 className='text-2xl font-semibold'>Comptes</h2>
        <div className='flex flex-col gap-8'>
          <MyNumberInput
            id='year'
            labelText={
              <>
                Année
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
            value={currentFinance.year ?? ''}
            onChange={(e) => updateFinanceAttribute('year', e.target.value)}
            error={errors['annual_finances_attributes.0.year'] !== undefined ? errors['annual_finances_attributes.0.year'] : errors['annual_finances_attributes.0.missing_information']}
          />

          <MyCheckbox
            id='certified'
            checked={currentFinance.certified ?? false}
            onCheckedChange={(checked) => updateFinanceAttribute('certified', checked)}
          >
            <div className='flex items-center'>
              Comptes certifiés
              <HelpTooltip className='ml-2'>
                Un commissaire aux comptes a validé la comptabilité de l'OSBL.
              </HelpTooltip>
            </div>
          </MyCheckbox>

          <MyNumberInput
            id='budget'
            labelText='Budget'
            min={0}
            step={0.01}
            value={currentFinance.budget ?? ''}
            onChange={(e) => updateFinanceAttribute('budget', e.target.value)}
            suffix='€'
          />

          <MyNumberInput
            id='treasury'
            labelText='Trésorerie'
            step={0.01}
            value={currentFinance.treasury ?? ''}
            onChange={(e) => updateFinanceAttribute('treasury', e.target.value)}
            suffix='€'
          />

          <FundManagementSection
            title='Sources de financement'
            items={currentFinance.fund_sources_attributes ?? []}
            typeList={FundSourceTypeList}
            baseErrorPath='annual_finances_attributes.0.fund_sources_attributes'
            errors={errors}
            onUpdate={(items) => updateFinanceAttribute('fund_sources_attributes', items)}
            clearErrors={clearErrors}
            setError={setError}
          />

          <FundManagementSection
            title='Allocation des fonds'
            items={currentFinance.fund_allocations_attributes ?? []}
            typeList={FundAllocationTypeList}
            baseErrorPath='annual_finances_attributes.0.fund_allocations_attributes'
            errors={errors}
            onUpdate={(items) => updateFinanceAttribute('fund_allocations_attributes', items)}
            clearErrors={clearErrors}
            setError={setError}
          />

          <Separator />

          <MyNumberInput
            id='employees_count'
            labelText="Nombre d'employé"
            min={0}
            value={currentFinance.employees_count ?? ''}
            onChange={(e) => updateFinanceAttribute('employees_count', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
