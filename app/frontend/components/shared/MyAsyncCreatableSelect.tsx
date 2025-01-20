import { ReactElement, useState, useCallback } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { FormProps, FormData } from '@/pages/Contribution/types'
import { toast } from 'sonner'

interface Option {
  readonly label: string
  readonly value: string
}

interface MyAsyncCreatableSelectProps extends Pick<FormProps, 'data' | 'setData'> {
  attributeName: keyof FormData
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
        setData(attributeName, [...(data[attributeName] as any[]), {
          [`${resource.slice(0, -1)}_id`]: newOption.value
        }] as any)
      } catch (error) {
        toast.error(`Une erreur est survenue lors de la création de "${inputValue}"`)
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
      classNames={{
        multiValueLabel: () => 'bg-secondary',
        multiValueRemove: () => 'bg-secondary'
      }}
      placeholder={placeholder}
      formatCreateLabel={(inputValue: string) => `Créer "${inputValue}"`}
      isValidNewOption={isValidNewOption}
      loadingMessage={() => 'Recherche...'}
      noOptionsMessage={() => 'Aucune suggestion'}
    />
  )
}
