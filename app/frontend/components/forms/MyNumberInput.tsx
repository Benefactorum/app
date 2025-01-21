import { ReactElement, ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputError from '@/components/forms/InputError'
import { X } from 'lucide-react'

interface BaseMyNumberInputProps {
  required?: boolean
  disabled?: boolean
  value?: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  autoFocus?: boolean
  error?: string
  id: string
  min?: number
  max?: number
  step?: number
  hideSpinButton?: boolean
  onReset?: () => void
}

interface WithLabel extends BaseMyNumberInputProps {
  labelText: string | ReactNode
  placeholder?: string
}

interface WithoutLabel extends BaseMyNumberInputProps {
  labelText?: undefined
  placeholder: string
}

type MyNumberInputProps = WithLabel | WithoutLabel

export default function MyNumberInput (props: MyNumberInputProps): ReactElement {
  const {
    id,
    labelText,
    required,
    disabled,
    value,
    onChange,
    onReset,
    placeholder,
    autoFocus,
    error,
    min,
    max,
    step,
    hideSpinButton = true
  } = props

  const errorClass = error != null ? 'border-red-600' : ''
  const spinButtonClass = hideSpinButton ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''

  return (
    <div className='flex flex-col'>
      {
        (labelText !== undefined && labelText !== '')
          ? <Label htmlFor={id}>{labelText}</Label>
          : <Label htmlFor={id} className='sr-only'>{placeholder}</Label>
      }

      <div className='relative mt-4'>
        <Input
          id={id}
          type='number'
          required={required}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          min={min}
          max={max}
          step={step}
          className={`bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 ${errorClass} ${spinButtonClass} ${Boolean(value) && (onReset != null) ? 'pr-8' : ''}`}
        />
        {value !== '' && (onReset != null) && (
          <button
            type='button'
            onClick={onReset}
            className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
            aria-label='Clear input'
          >
            <X size={16} />
          </button>
        )}
      </div>
      {Boolean(error) && <InputError>{error}</InputError>}
    </div>
  )
}
