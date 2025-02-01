import { ReactElement, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface MyFileInputProps {
  id: string
  labelText?: string | ReactElement
  accept?: string
  required?: boolean
  error?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  ref?: React.RefObject<HTMLInputElement>
}

export default function MyFileInput ({
  id,
  labelText,
  accept,
  required,
  error,
  onChange,
  placeholder = 'Sélectionner un fichier',
  ref
}: MyFileInputProps): ReactElement {
  const inputRef = ref ?? useRef<HTMLInputElement>(null)

  const handleReset = (): void => {
    if (inputRef.current != null) {
      inputRef.current.value = ''
      // Trigger onChange with a fake event to notify parent component
      const event = new Event('change', { bubbles: true }) as unknown as React.ChangeEvent<HTMLInputElement>
      Object.defineProperty(event, 'target', { value: { value: '', files: null } })
      onChange(event)
    }
  }

  return (
    <div className='space-y-2'>
      {Boolean(labelText) && (
        <label htmlFor={id} className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
          {labelText}
        </label>
      )}
      <div className='relative'>
        <Input
          ref={inputRef}
          id={id}
          type='file'
          required={required}
          accept={accept}
          onChange={onChange}
          placeholder={placeholder}
          className={`${
            error !== undefined
              ? 'border-red-600'
              : ''
          } pr-10 bg-white focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-primary focus:border-primary focus:outline-none`}
        />
        {((inputRef.current?.files) != null) && inputRef.current.files.length > 0 && (
          <button
            type='button'
            onClick={handleReset}
            className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100'
            aria-label='Reset file input'
          >
            <X className='h-4 w-4 text-gray-500' />
          </button>
        )}
      </div>
      {error !== undefined && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  )
}
