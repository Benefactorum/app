import { ReactElement, useState, useCallback } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import axios from 'axios'
import debounce from 'lodash.debounce'

interface Option {
  readonly label: string
  readonly value: string
}

interface MyAsyncCreatableSelectProps {
  data: any
  setData: (key: string, value: any) => void
  attributeName: 'osbls_intervention_areas_attributes' | 'osbls_keywords_attributes'
  resource: string
  minInputLength?: number
  placeholder: string
}

const createOption = (data: { id: number, name: string }): Option => ({
  label: data.name,
  value: String(data.id)
})

export default function MyAsyncCreatableSelect ({
  data,
  setData,
  attributeName,
  resource,
  minInputLength = 3,
  placeholder
}: MyAsyncCreatableSelectProps): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState<Option[]>([])

  const fetchOptions = async (inputValue: string): Promise<Option[]> => {
    if (inputValue.length < minInputLength) return []

    const response = await fetch(`/${resource}?query=${encodeURIComponent(inputValue)}`)
    const data = await response.json()
    return data.map((data: { id: number, name: string }) => createOption(data))
  }

  const debouncedFetchOptions = useCallback(
    debounce((inputValue: string, callback: (options: Option[]) => void) => {
      void fetchOptions(inputValue).then(callback)
    }, 300),
    []
  )

  const promiseOptions = async (inputValue: string): Promise<Option[]> => {
    return await new Promise((resolve) => {
      debouncedFetchOptions(inputValue, resolve)
    })
  }

  const handleCreate = (inputValue: string): void => {
    void (async () => {
      setIsLoading(true)
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        const response = await axios.post(
          `/${resource}`,
          { name: inputValue },
          {
            headers: {
              'X-CSRF-Token': csrfToken
            }
          }
        )
        const newOption = createOption(response.data)
        setValue((prev) => [...prev, newOption])
        setData(attributeName, [...(data[attributeName] ?? []), {
          [`${resource.slice(0, -1)}_id`]: newOption.value
        }] as any)
      } finally {
        setIsLoading(false)
      }
    })()
  }

  const isValidNewOption = (inputValue: string): boolean => {
    const normalizedInput = inputValue.trim().toLowerCase().replace(/^./, char => char.toUpperCase())
    return inputValue.length >= 3 && inputValue.length <= 30 && !value.some(option => option.label === normalizedInput)
  }

  return (
    <AsyncCreatableSelect
      isMulti
      // cacheOptions
      value={value}
      loadOptions={promiseOptions}
      onCreateOption={handleCreate}
      onChange={(value) => {
        setValue(value as Option[])
        setData(attributeName, (value as Option[]).map(option => ({
          [`${resource.slice(0, -1)}_id`]: option.value
        })) as any)
      }}
      isDisabled={isLoading}
      isLoading={isLoading}
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: '0.375rem', // border-radius-md
          border: state.isFocused ? 'none' : '1px solid hsl(var(--border))',
          outline: state.isFocused ? '1px solid hsl(var(--primary))' : 'none',
          '&:hover': {
            borderColor: 'hsl(var(--border))'
          }
        }),
        multiValue: (base) => ({
          ...base,
          border: '1px solid hsla(var(--foreground) / 0.1)',
          borderRadius: '9999px',
          backgroundColor: 'hsl(var(--secondary))',
          padding: '0rem 0.3rem',
          fontWeight: 600,
          fontSize: '0.825rem',
          lineHeight: '1rem'
        }),
        multiValueRemove: (base) => ({
          ...base,
          '&:hover': {
            backgroundColor: 'hsl(var(--secondary))',
            color: 'hsl(var(--foreground))'
          }
        })
      }}
      placeholder={placeholder}
      formatCreateLabel={(inputValue: string) => `Ajouter "${inputValue}"`}
      isValidNewOption={isValidNewOption}
      loadingMessage={() => 'Recherche...'}
      noOptionsMessage={() => 'Aucune suggestion'}
    />
  )
}
