import { Fragment, ReactElement } from 'react'
import { FundRecord } from '@/pages/Contribution/types'
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
import MyNumberInput from '@/components/forms/MyNumberInput'
import InputError from '@/components/forms/InputError'

interface FundManagementSectionProps {
  title: string
  items: FundRecord[]
  typeList: Array<{ value: string, label: string, group: string }>
  baseErrorPath: string
  errors: Record<string, string>
  onUpdate: (items: FundRecord[]) => void
  clearErrors: (path: string) => void
}

export default function FundManagementSection ({
  title,
  items,
  typeList,
  baseErrorPath,
  errors,
  onUpdate,
  clearErrors
}: FundManagementSectionProps): ReactElement {
  function handleFundChange (
    index: number,
    field: keyof FundRecord,
    value: any
  ): void {
    const updatedItems = items.map((item: FundRecord, i: number) =>
      i === index ? { ...item, [field]: value } : item
    )

    onUpdate(updatedItems)

    if (field === 'percent' && value !== '') {
      clearErrors(`${baseErrorPath}.total_percent`)
    }
  }

  function handleAdd (e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    const newItem = { type: undefined, percent: undefined, amount: undefined }
    onUpdate([...items, newItem])
  }

  function handleRemove (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ): void {
    e.preventDefault()
    const updatedItems = items.filter((_, i) => i !== index)
    onUpdate(updatedItems)
  }

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between gap-16'>
        <Label>{title}</Label>
        <Button
          onClick={handleAdd}
          disabled={Boolean((items?.length ?? 0) >= typeList.length)}
        >
          <PlusIcon className='w-4 h-4' />
          Ajouter
        </Button>
      </div>

      {Boolean(errors[`${baseErrorPath}.total_percent`]) && (
        <InputError>
          {errors[`${baseErrorPath}.total_percent`]}
        </InputError>
      )}

      {items?.map((item, index) => (
        <div
          key={`${baseErrorPath}-${item.type ?? 'new'}-${index}`}
          className='flex items-center space-x-4'
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
                item.type === type.value ||
                !items.some(source => source.type === type.value)
              ).map((type, i) => (
                <Fragment key={type.value}>
                  {i > 0 &&
                    type.group === 'detailed' &&
                    typeList[i - 1]?.group === 'main' && (
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
      ))}
    </div>
  )
}
