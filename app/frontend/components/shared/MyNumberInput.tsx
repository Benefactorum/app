import { ReactElement, ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputError from '@/components/shared/InputError'

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
  hideIncrementor?: boolean
  suffix?: string
  noErrorMessage?: boolean
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
    placeholder,
    autoFocus,
    error,
    min,
    max,
    step,
    hideIncrementor = true,
    suffix,
    noErrorMessage = false
  } = props

  const errorClass = error != null ? 'border-red-600' : ''
  const hideIncrementorClass = hideIncrementor ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''
  const suffixClass = suffix !== undefined ? 'pr-6' : ''

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
          className={`bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 ${errorClass} ${hideIncrementorClass} ${suffixClass}`}
        />
        {suffix !== undefined && value !== undefined && Number(value) > 0 && (
          <span className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none'>
            {suffix}
          </span>
        )}
      </div>
      {Boolean(error) && !noErrorMessage && <InputError>{error}</InputError>}
    </div>
  )
}
