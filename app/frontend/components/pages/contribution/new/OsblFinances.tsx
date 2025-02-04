import React, { ReactElement, useState } from 'react'
import { FormProps, AnnualFinance } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import { PencilIcon, PlusIcon, TrashIcon, ArrowUpDown } from 'lucide-react'
import {
  Sheet,
  SheetTrigger
} from '@/components/ui/sheet'
import OsblFinanceSheet from '@/components/pages/contribution/new/OsblFinances/OsblFinanceSheet'

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
              <PlusIcon className='w-4 h-4' />
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
          {finances
            .map((finance, index) => {
              return (
                <Sheet key={`finance-${finance.year}`}>
                  <div className='flex items-center justify-between p-4 border rounded-lg bg-white'>
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
                    data={data}
                    finance={finance}
                    index={index}
                    onUpdate={(finance) => addFinance(finance, index)}
                    errors={errors}
                    clearErrors={clearErrors}
                    setError={setError}
                  />
                </Sheet>
              )
            })}
        </div>
      )}
    </div>
  )
}
