import React, { ReactElement, useState } from 'react'
import { FormProps, AnnualFinance } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import { PlusIcon, ArrowUpDown } from 'lucide-react'
import {
  Sheet,
  SheetTrigger
} from '@/components/ui/sheet'
import OsblFinanceSheet from '@/components/pages/contribution/new/OsblFinances/OsblFinanceSheet'
import SheetTriggerItem from '@/components/pages/contribution/new/shared/SheetTriggerItem'

export default function OsblFinances ({ data, setData, errors, clearErrors, setError }: FormProps): ReactElement {
  const [sortAscending, setSortAscending] = useState(false)
  const finances = data.annual_finances_attributes ?? []

  function addFinance (finance: AnnualFinance, index: number): void {
    const updatedFinances = [...finances]
    updatedFinances[index] = finance

    setData('annual_finances_attributes', updatedFinances)
  }

  function handleFinanceRemove (e: React.MouseEvent<HTMLButtonElement>, index: number): void {
    e.preventDefault()
    setData('annual_finances_attributes', finances.filter((_, i) => i !== index))
  }

  function handleSort (): void {
    setSortAscending(!sortAscending)
    const sortedFinances = [...finances]
      .sort((a, b) => sortAscending
        ? (a.year) - (b.year)
        : (b.year) - (a.year))
    setData('annual_finances_attributes', sortedFinances)
  }

  return (
    <div className='bg-white rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col w-full h-full'>
      <div className='flex items-center gap-4 justify-between flex-wrap'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 w-[145px]'>

            <h2 className='text-2xl font-semibold'>Comptes</h2>
            <Button
              variant='ghost'
              size='icon'
              onClick={(e) => {
                e.preventDefault()
                handleSort()
              }}
              disabled={finances.length < 2}
            >
              <ArrowUpDown />
            </Button>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline'>
              <PlusIcon />
              <span className='ml-2 hidden sm:block lg:hidden xl:block'>Ajouter</span>
            </Button>
          </SheetTrigger>
          <OsblFinanceSheet
            data={data}
            key={`finance-${finances.length}`}
            finance={{}}
            index={finances.length}
            onUpdate={(finance) => addFinance(finance, finances.length)}
            errors={errors}
            clearErrors={clearErrors}
            setError={setError}
          />
        </Sheet>
      </div>

      {finances.length > 0 && (
        <div className='flex flex-col gap-4'>
          {finances.map((finance, index) => (
            <Sheet key={`finance-${finance.year}`}>
              <SheetTriggerItem
                displayName={finance.year.toString()}
                onRemove={(e) => handleFinanceRemove(e, index)}
              />

              <OsblFinanceSheet
                data={data}
                finance={finance}
                index={index}
                onUpdate={(finance) => addFinance(finance, index)}
                errors={errors}
                clearErrors={clearErrors}
                setError={setError}
              />
            </Sheet>
          ))}
        </div>
      )}
    </div>
  )
}
