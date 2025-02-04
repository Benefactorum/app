import { Fragment, ReactElement } from 'react'
import { FundRecord } from '@/pages/Contribution/types'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MyNumberInput from '@/components/shared/MyNumberInput'
import InputError from '@/components/shared/InputError'
import { Separator } from '@/components/ui/separator'

interface FundManagementSectionProps {
  title: string
  items: FundRecord[]
  typeList: string[]
  baseErrorPath: string
  onUpdate: (items: Array<Partial<FundRecord>>) => void
  errors: Record<string, string>
  clearErrors: (path: string) => void
}

export default function FundManagementSection ({
  title,
  items,
  typeList,
  baseErrorPath,
  onUpdate,
  errors,
  clearErrors
}: FundManagementSectionProps): ReactElement {
  function handleFundChange (index: number, field: keyof FundRecord, value: any): void {
    const updatedItems = items.map((item: FundRecord, i: number) =>
      i === index ? { ...item, [field]: value } : item
    )

    onUpdate(updatedItems)

    if (field === 'percent') {
      clearErrors(`${baseErrorPath}.total_percent`)
    }
  }

  function handleAdd (e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault() // prevent form submission
    onUpdate([...items, {}])
  }

  function handleRemove (e: React.MouseEvent<HTMLButtonElement>, index: number): void {
    e.preventDefault()
    onUpdate(items.filter((_, i) => i !== index))
    clearErrors(`${baseErrorPath}.total_percent`)
  }

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between gap-16'>
        <Label>{title}</Label>
        <Button
          onClick={handleAdd}
          variant='outline'
          className='bg-white'
          disabled={items.length >= typeList.length}
        >
          <PlusIcon />
          Ajouter
        </Button>
      </div>

      {Boolean(errors[`${baseErrorPath}.total_percent`]) && (
        <InputError>
          {errors[`${baseErrorPath}.total_percent`]}
        </InputError>
      )}

      {items.map((item, index) => (
        <Fragment key={`${baseErrorPath}-${index}`}>
          <div
            className='flex flex-wrap items-center gap-x-4 sm:flex-nowrap sm:items-center sm:space-x-4'
          >
            <Select
              value={item.type}
              onValueChange={(value) => handleFundChange(index, 'type', value)}
              required
            >
              <SelectTrigger
                className='w-60 data-[placeholder]:text-muted-foreground mt-4'
              >
                <SelectValue placeholder='Type *' />
              </SelectTrigger>
              <SelectContent>
                {typeList.filter(type =>
                  item.type === type ||
                !items.some(source => source.type === type)
                ).map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <MyNumberInput
              id='percent'
              min={0.01}
              max={100}
              step={0.01}
              value={item.percent ?? ''}
              onChange={(e) => handleFundChange(index, 'percent', e.target.value)}
              placeholder='% *'
              suffix='%'
              required
            />

            <MyNumberInput
              id='amount'
              step={0.01}
              value={item.amount ?? ''}
              onChange={(e) => handleFundChange(index, 'amount', e.target.value)}
              placeholder='Montant'
              suffix='€'
            />

            <Button
              onClick={(e) => handleRemove(e, index)}
              variant='ghost'
              className='text-red-500 hover:text-red-700 p-0 h-auto mt-4'
            >
              <TrashIcon className='w-4 h-4' />
            </Button>
          </div>
          <Separator className='mt-4' />
        </Fragment>
      ))}
    </div>
  )
}
