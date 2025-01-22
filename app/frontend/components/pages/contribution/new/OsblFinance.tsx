import { ReactElement } from 'react'
import { FormProps } from '@/pages/Contribution/types'
import MyNumberInput from '@/components/forms/MyNumberInput'
import HelpTooltip from '@/components/shared/HelpTooltip'

export default function OsblFinance ({ data, setData }: FormProps): ReactElement {
  const currentFinance = (data.annual_finances_attributes?.[0] ?? {})

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
            placeholder={String(new Date().getFullYear() - 1)}
            min={1000}
            max={new Date().getFullYear()}
            value={currentFinance.year ?? ''}
            onChange={(e) => {
              setData('annual_finances_attributes', [{
                ...currentFinance,
                year: Number(e.target.value)
              }])
            }}
            onReset={() => {
              setData('annual_finances_attributes', [{
                ...currentFinance,
                year: undefined
              }])
            }}
          />

          <MyNumberInput
            id='budget'
            labelText='Budget :'
            min={0}
            step={1.00}
            value={currentFinance.budget ?? ''}
            onChange={(e) => {
              setData('annual_finances_attributes', [{
                ...currentFinance,
                budget: Number(e.target.value)
              }])
            }}
            onReset={() => {
              setData('annual_finances_attributes', [{
                ...currentFinance,
                budget: undefined
              }])
            }}
          />

          <MyNumberInput
            id='treasury'
            labelText='Trésorerie :'
            value={currentFinance.treasury ?? ''}
            onChange={(e) => {
              setData('annual_finances_attributes', [{
                ...currentFinance,
                treasury: Number(e.target.value)
              }])
            }}
            onReset={() => {
              setData('annual_finances_attributes', [{
                ...currentFinance,
                treasury: undefined
              }])
            }}
          />

          <MyNumberInput
            id='employees_count'
            labelText="Nombre d'employé :"
            min={0}
            value={currentFinance.employees_count ?? ''}
            onChange={(e) => {
              setData('annual_finances_attributes', [{
                ...currentFinance,
                employees_count: Number(e.target.value)
              }])
            }}
            onReset={() => {
              setData('annual_finances_attributes', [{
                ...currentFinance,
                employees_count: undefined
              }])
            }}
          />
        </div>
      </div>
    </div>
  )
}
