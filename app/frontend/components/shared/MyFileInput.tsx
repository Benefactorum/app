import { ReactElement, useRef, useState } from 'react'
import MyInput from '@/components/shared/MyInput'

interface MyFileInputProps {
  id: string
  labelText?: string | ReactElement
  accept?: string
  required?: boolean
  error?: string
  onChange: (file: File | undefined) => void
  file?: File
}

export default function MyFileInput ({
  id,
  labelText,
  accept,
  required = false,
  error,
  onChange,
  file
}: MyFileInputProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasFile, setHasFile] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const fileAttached = (e.target.files != null) && e.target.files.length > 0
    setHasFile(!!fileAttached)
    onChange(e.target.files?.[0] ?? undefined)
  }

  const handleReset = (): void => {
    if (inputRef.current != null) {
      inputRef.current.value = ''
      setHasFile(false)
    }
    onChange(undefined)
  }

  return (
    <div className='flex flex-col'>
      {file !== undefined && !hasFile
        ? (
          <MyInput
            labelText={labelText}
            value={file.name}
            readOnly
            showResetButton
            onReset={handleReset}
            error={error}
          />
          )
        : (
          <MyInput
            labelText={labelText}
            ref={inputRef}
            id={id}
            type='file'
            required={required && file === undefined}
            accept={accept}
            onChange={handleFileChange}
            error={error}
            showResetButton={hasFile}
            onReset={handleReset}
          />
          )}
    </div>
  )
}
