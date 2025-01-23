import { Fragment, ReactElement } from 'react'
import { FormProps, AnnualFinance, FundSource } from '@/pages/Contribution/types'
import MyNumberInput from '@/components/forms/MyNumberInput'
import HelpTooltip from '@/components/shared/HelpTooltip'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator
} from '@/components/ui/select'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import InputError from '@/components/forms/InputError'

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
    }
  }

  function handleFundSourceChange (index: number, field: keyof FundSource, value: any): void {
    const updatedSources = currentFinance.fund_sources_attributes?.map((fs, i) =>
      i === index ? { ...fs, [field]: value } : fs
    )

    updateFinanceAttribute('fund_sources_attributes', updatedSources)

    if (value !== '') {
      clearErrors(`annual_finances_attributes.0.fund_sources_attributes.${index}.${field}`)
    }

    if (field === 'percent' && value !== '') {
      clearErrors('annual_finances_attributes.0.fund_sources_attributes.total_percent')
    }
  }

  function handleAddFundSource (e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    // e.stopPropagation()
    const newSource = { type: undefined, percent: undefined, amount: undefined }
    updateFinanceAttribute('fund_sources_attributes',
      [...(currentFinance.fund_sources_attributes ?? []), newSource]
    )
  }

  function handleRemoveFundSource (e: React.MouseEvent<HTMLButtonElement>, index: number): void {
    e.preventDefault()

    // Create new array without the removed fund source
    const updatedSources = (currentFinance.fund_sources_attributes ?? [])
      .filter((_, i) => i !== index)

    // Directly set the new array as the value
    setData('annual_finances_attributes', [{
      ...currentFinance,
      fund_sources_attributes: updatedSources
    }])

    // Clear errors for the removed index
    clearErrors(`annual_finances_attributes.0.fund_sources_attributes.${index}.type`)
    clearErrors(`annual_finances_attributes.0.fund_sources_attributes.${index}.percent`)

    // Update error indices for remaining items
    for (let i = index + 1; i < (currentFinance.fund_sources_attributes?.length ?? 0); i++) {
      ['type', 'percent'].forEach(field => {
        const errorPath = `annual_finances_attributes.0.fund_sources_attributes.${i}.${field}`
        const error = errors?.[errorPath]
        if (error !== undefined) {
          setError(`annual_finances_attributes.0.fund_sources_attributes.${i - 1}.${field}`, error)
          clearErrors(errorPath)
        }
      })
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

          <MyNumberInput
            id='employees_count'
            labelText="Nombre d'employé"
            min={0}
            value={currentFinance.employees_count ?? ''}
            onChange={(e) => updateFinanceAttribute('employees_count', e.target.value)}
          />

          <div className='flex flex-col'>
            <div className='flex items-center justify-between gap-16'>
              <Label>Sources de financement</Label>
              <Button
                onClick={handleAddFundSource}
                disabled={
                  Boolean((currentFinance.fund_sources_attributes?.length ?? 0) >= 4)
                }
              >
                <PlusIcon className='w-4 h-4' />
                Ajouter
              </Button>
            </div>

            {errors['annual_finances_attributes.0.fund_sources_attributes.total_percent'] && (
              <InputError>
                {errors['annual_finances_attributes.0.fund_sources_attributes.total_percent']}
              </InputError>
            )}

            {currentFinance.fund_sources_attributes?.map((fundSource, index) => (
              <div
                key={`fund-source-${fundSource.type ?? 'new'}-${index}`}
                className='flex items-center space-x-4'
              >
                <Select
                  value={fundSource.type}
                  onValueChange={(value) => handleFundSourceChange(index, 'type', value)}
                >
                  <SelectTrigger
                    className={`w-[200px] data-[placeholder]:text-muted-foreground mt-4 ${errors[`annual_finances_attributes.0.fund_sources_attributes.${index}.type`] !== undefined ? 'border-red-600' : ''}`}
                  >
                    <SelectValue placeholder='Type' />
                  </SelectTrigger>
                  <SelectContent>
                    {FundSourceTypeList.filter(type =>
                      fundSource.type === type.value ||
                      !(currentFinance.fund_sources_attributes ?? []).some(source => source.type === type.value)
                    ).map((type, i) => (
                      <Fragment key={type.value}>
                        {i > 0 &&
                         type.group === 'detailed' &&
                         FundSourceTypeList[i - 1]?.group === 'main' && (
                           <SelectSeparator className='my-2' />
                        )}
                        <SelectItem
                          value={type.value}
                          className={type.group === 'detailed' ? 'text-muted-foreground' : ''}
                        >
                          {type.label}
                        </SelectItem>
                      </Fragment>
                    ))}
                  </SelectContent>
                </Select>

                <MyNumberInput
                  id='percent'
                  min={0}
                  max={100}
                  step={0.01}
                  value={fundSource.percent ?? ''}
                  onChange={(e) => handleFundSourceChange(index, 'percent', e.target.value)}
                  placeholder='%'
                  suffix='%'
                  error={errors[`annual_finances_attributes.0.fund_sources_attributes.${index}.percent`]}
                  noErrorMessage
                />

                <MyNumberInput
                  id='amount'
                  step={0.01}
                  value={fundSource.amount ?? ''}
                  onChange={(e) => handleFundSourceChange(index, 'amount', e.target.value)}
                  placeholder='Montant'
                  suffix='€'
                />

                <button
                  onClick={(e) => handleRemoveFundSource(e, index)}
                  className='text-red-500 hover:text-red-700 focus:outline-none mt-4'
                >
                  <TrashIcon className='w-4 h-4' />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
