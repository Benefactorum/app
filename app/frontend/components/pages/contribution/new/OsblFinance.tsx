import { ReactElement } from 'react'
import { Label } from '@/components/ui/label'
import { FormProps } from '@/pages/Contribution/types'
import { Input } from '@/components/ui/input'
// import HelpTooltip from '@/components/shared/HelpTooltip'

export default function OsblFinance ({ data, setData, errors, clearErrors }: FormProps): ReactElement {
  return (
    <div className='flex flex-wrap gap-16 mx-auto justify-center'>
      <div className='bg-white w-full sm:w-auto rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col'>
        <h2 className='text-2xl font-semibold'>Comptes</h2>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col'>
            <Label htmlFor='annual_budget'>Année :</Label>
            <Input
              id='year'
              type='number'
              min={0}
              max={new Date().getFullYear()}
              value={data.annual_finances_attributes?.[0]?.year ?? ''}
              onChange={(e) => {
                setData('annual_finances_attributes', [{ ...(data.annual_finances_attributes?.[0] ?? {}), year: Number(e.target.value) }])
              }}
              className='bg-white mt-4 focus-visible:ring-0 focus-visible:border-primary focus-visible:ring-offset-0'
            />
          </div>
          <div className='flex flex-col'>
            <Label htmlFor='budget'>Budget :</Label>
            <Input
              id='budget'
              type='number'
              min={0}
              step={1.00}
              value={data.annual_finances_attributes?.[0]?.budget ?? ''}
              onChange={(e) => {
                setData('annual_finances_attributes', [{
                  ...(data.annual_finances_attributes?.[0] ?? {}),
                  budget: Number(e.target.value),
                  year: data.annual_finances_attributes?.[0]?.year ?? new Date().getFullYear()
                }])
              }}
              className='bg-white mt-4 focus-visible:ring-0 focus-visible:border-primary focus-visible:ring-offset-0'
            />
          </div>
          <div className='flex flex-col'>
            <Label htmlFor='treasury'>Trésorerie :</Label>
            <Input
              id='treasury'
              type='number'
              value={data.annual_finances_attributes?.[0]?.treasury ?? ''}
              onChange={(e) => {
                setData('annual_finances_attributes', [{
                  ...(data.annual_finances_attributes?.[0] ?? {}),
                  treasury: Number(e.target.value),
                  year: data.annual_finances_attributes?.[0]?.year ?? new Date().getFullYear()
                }])
              }}
              className='bg-white mt-4 focus-visible:ring-0 focus-visible:border-primary focus-visible:ring-offset-0'
            />
          </div>
          <div className='flex flex-col'>
            <Label htmlFor='employees_count'>Nombre d'employé :</Label>
            <Input
              id='employees_count'
              type='number'
              min={0}
              value={data.annual_finances_attributes?.[0]?.employees_count ?? ''}
              onChange={(e) => {
                setData('annual_finances_attributes', [{
                  ...(data.annual_finances_attributes?.[0] ?? {}),
                  employees_count: Number(e.target.value),
                  year: data.annual_finances_attributes?.[0]?.year ?? new Date().getFullYear()
                }])
              }}
              className='bg-white mt-4 focus-visible:ring-0 focus-visible:border-primary focus-visible:ring-offset-0'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
