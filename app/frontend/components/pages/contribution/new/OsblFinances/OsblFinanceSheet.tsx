import React, { ReactElement, useRef, useState } from 'react'
import { AnnualFinance, FormProps } from '@/pages/Contribution/types'
import UnsavedChangesAlert from '@/components/shared/UnsavedChangesAlert'
import MyNumberInput from '@/components/shared/MyNumberInput'
import HelpTooltip from '@/components/shared/HelpTooltip'
import FundManagementSection from '@/components/pages/contribution/new/OsblFinances/FundManagementSection'
import MyCheckbox from '@/components/shared/MyCheckbox'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { CheckIcon, X } from 'lucide-react'
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import deepCleanData from '@/lib/deepCleanData'
import { z } from 'zod'
import { usePage } from '@inertiajs/react'

interface Props extends Omit<FormProps, 'setData'> {
  finance: Partial<AnnualFinance>
  index: number
  onUpdate: (finance: AnnualFinance) => void
}

const financeValidation = (data: AnnualFinance[], currentIndex: number): z.ZodType<any> => z.object({
  fund_sources_attributes: z.array(z.object({
    percent: z.number()
  })).optional()
    .refine((sources): sources is typeof sources => {
      if (sources === undefined || sources.length === 0) return true

      const sum = sources?.reduce((acc: number, source) => {
        const percent = source.percent !== undefined ? Number(source.percent) : 0
        return acc + percent
      }, 0)
      return sum === 100
    }, {
      message: 'La somme des pourcentages doit être égale à 100%.',
      path: ['total_percent']
    }),
  fund_allocations_attributes: z.array(z.object({
    percent: z.number()
  })).optional()
    .refine((allocations): allocations is typeof allocations => {
      if (allocations === undefined || allocations.length === 0) return true

      const sum = allocations?.reduce((acc: number, allocation) => {
        const percent = allocation.percent !== undefined ? Number(allocation.percent) : 0
        return acc + percent
      }, 0)
      return sum === 100
    }, {
      message: 'La somme des pourcentages doit être égale à 100%.',
      path: ['total_percent']
    })
}).passthrough()
  .refine(
    (finance) => {
      const financeCleaned = deepCleanData(finance)
      return !(Object.keys(financeCleaned).length === 1)
    },
    { message: 'Complétez les comptes pour cette année.', path: ['annual_finances_attributes', currentIndex, 'missing_information'] }
  ).refine(
    (finance) => {
      return !data.some((f, i) => i !== currentIndex && Number(f.year) === Number(finance.year))
    },
    { message: 'Un bilan comptable est déjà enregistré pour cette année.', path: ['annual_finances_attributes', currentIndex, 'missing_information'] }
  )

export default function OsblFinanceSheet ({
  finance,
  data,
  index,
  errors,
  onUpdate,
  clearErrors,
  setError
}: Props): ReactElement {
  const fundSourceTypes = usePage().props.fund_source_types as string[]
  const fundAllocationTypes = usePage().props.fund_allocation_types as string[]
  const formRef = useRef<HTMLFormElement>(null)
  const [sheetFinance, setSheetFinance] = useState<Partial<AnnualFinance>>(finance)

  function updateSheetFinance (field: keyof AnnualFinance, value: any): void {
    setSheetFinance(prev => ({
      ...prev,
      [field]: value
    }))

    if (field === 'year' && value === '') {
      clearErrors(`annual_finances_attributes.${index}.missing_information`)
    }
    if (field !== 'year' && value !== '') {
      clearErrors(`annual_finances_attributes.${index}.missing_information`)
    }

    if (field === 'year') {
      clearErrors(`annual_finances_attributes.${index}.year`)
    }
  }

  function handleSubmit (e: React.MouseEvent<HTMLButtonElement>): void {
    if (formRef.current?.reportValidity() === false) {
      e.preventDefault()
      return
    }

    const result = financeValidation(data.annual_finances_attributes ?? [], index).safeParse(sheetFinance)
    if (!result.success) {
      e.preventDefault()
      const issues = result.error.issues
      issues.forEach(issue => {
        setError(issue.path.join('.'), issue.message)
      })
      return
    }

    onUpdate(deepCleanData(sheetFinance) as AnnualFinance)
  }

  return (
    <SheetContent className='w-full sm:max-w-[600px] overflow-y-auto'>
      <form ref={formRef}>
        <SheetHeader>
          <SheetTitle>Comptes annuels</SheetTitle>
          <SheetDescription className='sr-only'>
            Renseignez les informations financières pour cette année.
          </SheetDescription>
        </SheetHeader>

        <UnsavedChangesAlert<Partial<AnnualFinance>> originalData={finance} currentData={sheetFinance} />

        <div className='flex flex-col gap-8 mt-8'>
          <MyNumberInput
            autoFocus
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
            value={sheetFinance.year ?? ''}
            onChange={(value) => updateSheetFinance('year', value)}
            required
            error={errors[`annual_finances_attributes.${index}.year`] ?? errors[`annual_finances_attributes.${index}.missing_information`]}
          />

          <MyCheckbox
            id={`certified-${index}`}
            checked={sheetFinance.certified ?? false}
            onCheckedChange={(checked) => updateSheetFinance('certified', checked)}
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
            value={sheetFinance.budget ?? ''}
            onChange={(value) => updateSheetFinance('budget', value)}
            suffix='€'
          />

          <MyNumberInput
            id={`treasury-${index}`}
            labelText='Trésorerie'
            step={0.01}
            value={sheetFinance.treasury ?? ''}
            onChange={(value) => updateSheetFinance('treasury', value)}
            suffix='€'
          />

          <FundManagementSection
            title='Sources de financement'
            items={sheetFinance.fund_sources_attributes ?? []}
            typeList={fundSourceTypes}
            baseErrorPath='fund_sources_attributes'
            onUpdate={(items) => updateSheetFinance('fund_sources_attributes', items)}
            errors={errors}
            clearErrors={clearErrors}
          />

          <FundManagementSection
            title='Allocation des fonds'
            items={sheetFinance.fund_allocations_attributes ?? []}
            typeList={fundAllocationTypes}
            baseErrorPath='fund_allocations_attributes'
            onUpdate={(items) => updateSheetFinance('fund_allocations_attributes', items)}
            errors={errors}
            clearErrors={clearErrors}
          />

          <Separator />

          <MyNumberInput
            id={`employees_count-${index}`}
            labelText="Nombre d'employés"
            min={0}
            value={sheetFinance.employees_count ?? ''}
            onChange={(value) => updateSheetFinance('employees_count', value)}
          />
        </div>

        <SheetFooter className='mt-16'>
          <SheetClose asChild>
            <Button variant='ghost' size='lg'>
              <X className='mr-2' />
              Annuler
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button onClick={handleSubmit} variant='default' size='lg'>
              <CheckIcon className='mr-2' />
              Valider
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  )
}
