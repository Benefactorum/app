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
  file?: File | File[] | string
}

export default function MyFileInput ({
  multiple = false,
  required = false,
  onChange,
  file,
  ...props
}: MyFileInputProps): ReactElement {
  const [inputKey, setInputKey] = useState<number>(0)
  const [inputHasFile, setinputHasFile] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files
    const fileAttached = files != null && files.length > 0
    setinputHasFile(!!fileAttached)

    if (multiple && files != null) {
      onChange(Array.from(files))
    } else {
      onChange(files?.[0])
    }
  }

  const handleReset = (): void => {
    setInputKey(prev => prev + 1)
    setinputHasFile(false)
    onChange(undefined)
  }

  function getFileName (file: File | File[] | string): string {
    if (Array.isArray(file)) {
      return file.map(f => f.name).join(', ')
    } else if (typeof file === 'string') {
      return file
    }
    return file.name
  }

  return (
    <div className='flex flex-col'>
      {file !== undefined && !inputHasFile
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
            showResetButton={inputHasFile}
            onReset={handleReset}
            {...props}
          />
          )}
    </div>
  )
}
