import { InputHTMLAttributes, ReactElement } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputError from '@/components/shared/InputError'
import { X } from 'lucide-react'

interface MyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  error?: string
  showResetButton?: boolean
  onReset?: () => void
  labelText?: string | ReactElement
}

export default function MyInput ({
  id,
  labelText,
  error,
  placeholder,
  className,
  showResetButton = false,
  onReset,
  ...props
}: MyInputProps): ReactElement {
  const errorClass = (error !== null && error !== undefined && error !== '') ? 'border-red-600' : ''

  return (
    <div className='flex flex-col gap-4'>
      {
        (labelText !== undefined && labelText !== '')
          ? <Label htmlFor={id}>{labelText}</Label>
          : <Label htmlFor={id} className='sr-only'>{placeholder}</Label>
      }

      <div className='relative'>
        <Input
          id={id}
          placeholder={placeholder}
          className={`bg-white focus-visible:ring-0 focus-visible:border-primary focus:border-primary focus:outline-none placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 ${errorClass} ${className ?? ''} ${showResetButton ? 'pr-10' : ''}`}
          {...props}
        />
        {showResetButton && (onReset !== undefined) && (
          <button
            type='button'
            onClick={onReset}
            className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100'
            aria-label='Reset input value'
          >
            <X className='h-4 w-4 text-gray-500' />
          </button>
        )}
      </div>
      {Boolean(error) && <InputError>{error}</InputError>}
    </div>
  )
}
