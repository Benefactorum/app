import React, { ReactElement, useState } from 'react'
import { FormProps, AnnualFinance } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import { PencilIcon, PlusIcon, TrashIcon, ArrowUpDown } from 'lucide-react'
import {
  Sheet,
  SheetTrigger
} from '@/components/ui/sheet'
import OsblFinanceSheet from './OsblFinanceSheet'
import InputError from '@/components/forms/InputError'

export default function OsblFinance ({ data, setData, errors, clearErrors, setError }: FormProps): ReactElement {
  const [sortAscending, setSortAscending] = useState(false)
  const finances = data.annual_finances_attributes ?? []
  const newFinanceIndex = finances.length - 1

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

    if (attribute !== 'year') {
      clearErrors(`annual_finances_attributes.${index}.missing_information`)
    }

    if (attribute === 'year') {
      clearErrors(`annual_finances_attributes.${index}.year`)
      clearErrors(`annual_finances_attributes.${index}.missing_information`)

      const modifiedYear = finances[index]?.year
      const remainingYears = finances.filter((_, i) => i !== index).map(f => f.year)
      if (Number(modifiedYear) > 0 && remainingYears.includes(modifiedYear)) {
        clearErrors('annual_finances_attributes.duplicate_years')
      }
    }
  }

  function handleFinanceAdd (): void {
    const lastFinance = finances[newFinanceIndex]
    const isLastFinanceEmpty = lastFinance !== undefined && Object.keys(lastFinance).length === 0

    if (!isLastFinanceEmpty) {
      setData('annual_finances_attributes', [...finances, {}])
    }
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
    clearErrors(`annual_finances_attributes.${index}.year`)

    const removedYear = finances[index]?.year
    const remainingYears = finances.filter((_, i) => i !== index).map(f => f.year)
    if (removedYear != null && remainingYears.includes(removedYear)) {
      clearErrors('annual_finances_attributes.duplicate_years')
    }

    // Update error indices for remaining items after the removed index
    Object.keys(errors).forEach(errorKey => {
      if (errorKey.startsWith('annual_finances_attributes.')) {
        const match = errorKey.match(/annual_finances_attributes\.(\d+)/)
        if (match != null) {
          const errorIndex = parseInt(match[1])
          if (errorIndex > index) {
            const newKey = errorKey.replace(
              `annual_finances_attributes.${errorIndex}`,
              `annual_finances_attributes.${errorIndex - 1}`
            )
            setError?.(newKey, errors[errorKey])
            clearErrors(errorKey)
          }
        }
      }
    })
  }

  function handleSort (): void {
    setSortAscending(!sortAscending)
    const sortedFinances = [...finances]
      .filter(finance => Object.keys(finance).length > 0)
      .sort((a, b) => sortAscending
        ? (a.year ?? 0) - (b.year ?? 0)
        : (b.year ?? 0) - (a.year ?? 0))
    setData('annual_finances_attributes', sortedFinances)
  }

  const hasFinanceErrors = Object.keys(errors).some(key =>
    key.startsWith('annual_finances_attributes')
  )

  return (
    <div className='bg-white rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col w-full h-full'>
      <div className='flex items-center gap-4 justify-between flex-wrap'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 w-[145px]'>

            <h2 className='text-2xl font-semibold'>Comptes</h2>
            {finances.filter(finance => Object.keys(finance).length > 1).length > 1 && (
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.preventDefault()
                  handleSort()
                }}
                disabled={hasFinanceErrors}
              >
                <ArrowUpDown />
              </Button>
            )}
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' onClick={handleFinanceAdd}>
              <PlusIcon className='w-4 h-4' />
              <span className='ml-2 hidden sm:block lg:hidden xl:block'>Ajouter</span>
            </Button>
          </SheetTrigger>
          <OsblFinanceSheet
            finance={finances[newFinanceIndex] ?? {}}
            index={newFinanceIndex}
            errors={errors}
            onUpdate={(attribute, value) => updateFinanceAttribute(newFinanceIndex, attribute, value)}
            clearErrors={clearErrors}
            setError={(field: string, message: string) => setError?.(field, message)}
          />
        </Sheet>
      </div>
      {errors['annual_finances_attributes.duplicate_years'] !== undefined && (
        <InputError>
          {errors['annual_finances_attributes.duplicate_years']}
        </InputError>
      )}

      {finances.filter(finance => Object.keys(finance).length > 0).length > 0 && (
        <div className='flex flex-col gap-4'>
          {finances
            .filter(finance => Object.keys(finance).length > 0)
            .map((finance, index) => {
              const hasError = errors[`annual_finances_attributes.${index}.missing_information`] != null ||
                           errors[`annual_finances_attributes.${index}.fund_sources_attributes.total_percent`] != null ||
                           (finance.fund_sources_attributes?.some((_, i) =>
                             errors[`annual_finances_attributes.${index}.fund_sources_attributes.${i}.percent`] != null ||
                             errors[`annual_finances_attributes.${index}.fund_sources_attributes.${i}.type`] != null
                           ) ?? false) ||
                           errors[`annual_finances_attributes.${index}.fund_allocations_attributes.total_percent`] != null ||
                           (finance.fund_allocations_attributes?.some((_, i) =>
                             errors[`annual_finances_attributes.${index}.fund_allocations_attributes.${i}.percent`] != null ||
                             errors[`annual_finances_attributes.${index}.fund_allocations_attributes.${i}.type`] != null
                           ) ?? false) ||
                           finance.year == null ||
                           errors[`annual_finances_attributes.${index}.year`] !== undefined

              return (
                <Sheet key={`finance-${index}`}>
                  <div className={`flex items-center justify-between p-4 border rounded-lg ${hasError ? 'bg-red-50 border-red-600' : 'bg-white'}`}>
                    <p>{finance.year}</p>
                    <div className='flex gap-2'>
                      <SheetTrigger asChild>
                        <Button variant='outline' className='bg-white text-primary border-none'>
                          <PencilIcon />
                        </Button>
                      </SheetTrigger>
                      <Button
                        onClick={(e) => handleFinanceRemove(e, index)}
                        variant='outline'
                        className='bg-white text-red-500 border-none'
                      >
                        <TrashIcon className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>

                  <OsblFinanceSheet
                    finance={finance}
                    index={index}
                    errors={errors}
                    onUpdate={(attribute, value) => updateFinanceAttribute(index, attribute, value)}
                    clearErrors={clearErrors}
                    setError={(field: string, message: string) => setError?.(field, message)}
                  />
                </Sheet>
              )
            })}
        </div>
      )}
    </div>
  )
}
