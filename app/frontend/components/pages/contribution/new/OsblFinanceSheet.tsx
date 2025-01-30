import React, { ReactElement, useRef } from 'react'
import { AnnualFinance } from '@/pages/Contribution/types'
import MyNumberInput from '@/components/forms/MyNumberInput'
import HelpTooltip from '@/components/shared/HelpTooltip'
import FundManagementSection from './FundManagementSection'
import MyCheckbox from '@/components/forms/MyCheckbox'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { CheckIcon } from 'lucide-react'
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'

interface Props {
  finance: Partial<AnnualFinance>
  index: number
  errors: Record<string, string>
  onUpdate: (attribute: keyof AnnualFinance, value: any) => void
  clearErrors: (path: string) => void
  submitLabel?: string
  title?: string
  setError: (field: string, message: string) => void
}

const FundSourceTypeList = [
  { value: 'dons', label: 'Dons', group: 'main' },
  { value: 'aides_publiques', label: 'Aides publiques', group: 'main' },
  { value: 'revenus_d_activites', label: 'Revenus d\'activités', group: 'main' },
  { value: 'autre', label: 'Autre', group: 'main' }
]

const FundAllocationTypeList = [
  { value: 'missions_sociales', label: 'Missions sociales', group: 'main' },
  { value: 'frais_de_fonctionnement', label: 'Frais de fonctionnement', group: 'main' },
  { value: 'frais_de_recherche_de_fonds', label: 'Frais de recherche de fonds', group: 'main' },
  { value: 'autre', label: 'Autre', group: 'main' }
]

export default function OsblFinanceSheet ({
  finance,
  index,
  errors,
  onUpdate,
  clearErrors,
  setError,
  submitLabel = 'Valider',
  title = 'Comptes annuels'
}: Props): ReactElement {
  const formRef = useRef<HTMLFormElement>(null) as React.RefObject<HTMLFormElement>

  function handleSubmit (e: React.MouseEvent<HTMLButtonElement>): void {
    if (formRef.current.reportValidity() === false) {
      e.preventDefault()
    }
  }

  return (
    <SheetContent className='w-full sm:max-w-[600px] overflow-y-auto'>
      <form ref={formRef}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className='sr-only'>
            Renseignez les informations financières pour cette année.
          </SheetDescription>
        </SheetHeader>

        <div className='flex flex-col gap-8 mt-6'>
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
            value={finance.year ?? ''}
            onChange={(e) => onUpdate('year', e.target.value)}
            required
            error={errors[`annual_finances_attributes.${index}.year`] ?? errors[`annual_finances_attributes.${index}.missing_information`]}
          />

          <MyCheckbox
            id={`certified-${index}`}
            checked={finance.certified ?? false}
            onCheckedChange={(checked) => onUpdate('certified', checked)}
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
            onChange={(e) => onUpdate('budget', e.target.value)}
            suffix='€'
          />

          <MyNumberInput
            id={`treasury-${index}`}
            labelText='Trésorerie'
            step={0.01}
            value={finance.treasury ?? ''}
            onChange={(e) => onUpdate('treasury', e.target.value)}
            suffix='€'
          />

          <FundManagementSection
            title='Sources de financement'
            items={finance.fund_sources_attributes ?? []}
            typeList={FundSourceTypeList}
            baseErrorPath={`annual_finances_attributes.${index}.fund_sources_attributes`}
            errors={errors}
            onUpdate={(items) => onUpdate('fund_sources_attributes', items)}
            clearErrors={clearErrors}
            setError={setError}
          />

          <FundManagementSection
            title='Allocation des fonds'
            items={finance.fund_allocations_attributes ?? []}
            typeList={FundAllocationTypeList}
            baseErrorPath={`annual_finances_attributes.${index}.fund_allocations_attributes`}
            errors={errors}
            onUpdate={(items) => onUpdate('fund_allocations_attributes', items)}
            clearErrors={clearErrors}
            setError={setError}
          />

          <Separator />

          <MyNumberInput
            id={`employees_count-${index}`}
            labelText="Nombre d'employé"
            min={0}
            value={finance.employees_count ?? ''}
            onChange={(e) => onUpdate('employees_count', e.target.value)}
          />

          <Separator />
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={(e) => handleSubmit(e)} variant='default' size='lg' className='mx-auto mt-8'>
              <CheckIcon className='mr-2' />
              {submitLabel}
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  )
}
