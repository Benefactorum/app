import { ReactElement } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputError from '@/components/forms/InputError'

interface MyInputProps {
  type: string
  required?: boolean
  disabled?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  autoFocus?: boolean
  error?: string
  id: string
  labelText?: string
}

export default function MyInput (props: MyInputProps): ReactElement {
  const { id, labelText, type, required, disabled, value, onChange, placeholder, autoFocus, error } = props
  const errorClass = (error !== null && error !== undefined && error !== '') ? 'border-red-600' : ''

  return (
    <div className='flex flex-col'>
      {
        (labelText !== undefined && labelText !== '')
          ? <Label htmlFor={id}>{labelText}</Label>
          : <Label htmlFor={id} className='sr-only'>{placeholder}</Label>
      }

      <Input
        id={id}
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`bg-white mt-4 focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 ${errorClass}`}
      />
      {Boolean(error) && <InputError>{error}</InputError>}
    </div>
  )
}
