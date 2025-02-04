import { ReactElement, useState, useCallback } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { SelectOption } from '@/types/types'
import { MultiValue } from 'react-select'
import { toast } from 'sonner'
interface MyAsyncCreatableSelectProps {
  data: any
  setData: (key: string, value: any) => void
  attributeName: 'osbls_intervention_areas_attributes' | 'osbls_keywords_attributes'
  resource: string
  minInputLength?: number
  placeholder: string
}

interface BackendData {
  id: number
  name: string
}

const createOption = (data: BackendData): SelectOption => ({
  label: data.name,
  value: data.id
})

export default function MyAsyncCreatableSelect ({
  data,
  setData,
  attributeName,
  resource,
  minInputLength = 3,
  placeholder
}: MyAsyncCreatableSelectProps): ReactElement {
  const [value, setValue] = useState<MultiValue<SelectOption>>([])
  const [options, setOptions] = useState<SelectOption[]>([])

  const fetchOptions = async (inputValue: string): Promise<SelectOption[]> => {
    if (inputValue.length < minInputLength) return []

    try {
      const response = await fetch(`/${resource}?query=${encodeURIComponent(inputValue)}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json() as BackendData[]
      const options = data.map((data) => createOption(data))
      setOptions(options)
      return options
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const debouncedFetchOptions = useCallback(
    debounce((inputValue: string, callback: (options: SelectOption[]) => void) => {
      void fetchOptions(inputValue).then(callback)
    }, 300),
    []
  )

  const promiseOptions = async (inputValue: string): Promise<SelectOption[]> => {
    return await new Promise((resolve) => {
      debouncedFetchOptions(inputValue, resolve)
    })
  }

  const handleCreate = (inputValue: string): void => {
    void (async () => {
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
        if (response.status !== 201) {
          throw new Error('Network response was not 201')
        }
        const newOption = createOption(response.data)
        setValue((prev) => [...prev, newOption])
        setData(attributeName, [...(data[attributeName] ?? []), {
          [`${resource.slice(0, -1)}_id`]: newOption.value
        }])
      } catch (error) {
        console.log(error)
        toast.error(`Une erreur est survenue lors de la création de ${inputValue}`)
      }
    })()
  }

  function isValidNewOption (inputValue: string): boolean {
    const normalizedInput = inputValue.trim().toLowerCase().replace(/^./, char => char.toUpperCase())
    return inputValue.length >= 3 && inputValue.length <= 100 && !value.some(option => option.label === normalizedInput) && !options.some(option => option.label === normalizedInput)
  }

  return (
    <AsyncCreatableSelect
      isMulti
      // cacheOptions
      value={value}
      loadOptions={promiseOptions}
      options={options}
      isValidNewOption={isValidNewOption}
      onCreateOption={handleCreate}
      onChange={(value) => {
        setValue(value)
        setData(attributeName, value.map((option) => ({
          [`${resource.slice(0, -1)}_id`]: option.value
        })))
      }}
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
        }),
        placeholder: (base) => ({
          ...base,
          fontSize: '0.875rem'
        })
      }}
      placeholder={placeholder}
      formatCreateLabel={(inputValue) => `Ajouter "${inputValue}"`}
      loadingMessage={() => 'Recherche...'}
      noOptionsMessage={() => 'Aucune suggestion'}
    />
  )
}
