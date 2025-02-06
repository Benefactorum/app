import { ReactElement, InputHTMLAttributes, useState } from 'react'
import MyInput from '@/components/shared/MyInput'

// Omit the default onChange and onReset to override with custom types
interface MyFileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onReset'> {
  id: string
  labelText?: string | ReactElement
  multiple?: boolean
  required?: boolean
  error?: string
  onChange: (file: File | File[] | undefined) => void // your custom onChange handler
  file?: File | File[]
}

export default function MyFileInput ({
  multiple = false,
  required = false,
  onChange,
  file,
  ...props
}: MyFileInputProps): ReactElement {
  const [inputKey, setInputKey] = useState<number>(0)
  const [hasFile, setHasFile] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const fileAttached = (e.target.files != null) && e.target.files.length > 0
    setHasFile(!!fileAttached)

    if (multiple && e.target.files != null) {
      onChange(Array.from(e.target.files))
    } else {
      onChange(e.target.files?.[0])
    }
  }

  const handleReset = (): void => {
    setInputKey(prev => prev + 1)
    setHasFile(false)
    onChange(undefined)
  }

  function getFileName (file: File | File[]): string {
    if (Array.isArray(file)) {
      return file.map(f => f.name).join(', ')
    }
    return file.name
  }

  return (
    <div className='flex flex-col'>
      {file !== undefined && Array.isArray(file) && file.length > 0 && !hasFile
        ? (
          <MyInput
            value={getFileName(file)}
            readOnly
            showResetButton
            onReset={handleReset}
            {...props}
          />
          )
        : (
          <MyInput
            key={inputKey}
            type='file'
            required={required && file === undefined}
            multiple={multiple}
            onChange={handleFileChange}
            showResetButton={hasFile}
            onReset={handleReset}
            {...props}
          />
          )}
    </div>
  )
}
