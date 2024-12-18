import { ReactElement, ReactNode } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { InputError } from '@/components/InputError'

interface MyCheckboxProps {
  id?: string
  children: ReactNode
  required?: boolean
  disabled?: boolean
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  error?: string
}

export function MyCheckbox (props: MyCheckboxProps): ReactElement {
  const { id, children, required, disabled, checked, onCheckedChange, error } =
    props
  const errorClass = (error !== null && error !== undefined && error !== '') ? 'border-red-600' : ''

  return (
    <div>
      <div className='flex items-center space-x-4'>
        <Checkbox
          id={id}
          required={required}
          disabled={disabled}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={errorClass}
        />
        <Label htmlFor={id} className='leading-normal font-normal'>
          {children}
        </Label>
      </div>
      {Boolean(error) && <InputError>{error}</InputError>}
    </div>
  )
}
