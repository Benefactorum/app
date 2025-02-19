import { ReactElement, ReactNode } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import InputError from '@/components/shared/InputError'

interface MyCheckboxProps {
  id?: string
  children?: ReactNode
  required?: boolean
  disabled?: boolean
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  error?: string
  className?: string
}

export default function MyCheckbox (props: MyCheckboxProps): ReactElement {
  const { id, children, required, disabled, checked, onCheckedChange, error, className } =
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
          className={`${errorClass} ${className ?? ''}`}
        />
        {children !== undefined && (
          <Label htmlFor={id}>
            {children}
          </Label>
        )}
      </div>
      {Boolean(error) && <InputError>{error}</InputError>}
    </div>
  )
}
