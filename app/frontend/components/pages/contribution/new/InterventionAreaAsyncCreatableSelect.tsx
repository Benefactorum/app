import { ReactElement, useState, useCallback } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable' // https://react-select.com/home#welcome
import axios from 'axios'
import debounce from 'lodash.debounce' // Install lodash.debounce if not already installed: npm install lodash.debounce
import { FormProps } from '@/pages/Contribution/types'

interface Option {
  readonly label: string
  readonly value: string
}

const createOption = (data: { id: number, name: string }): Option => ({
  label: data.name,
  value: String(data.id)
})

export default function InterventionAreaAsyncCreatableSelect ({
  data,
  setData
}: Pick<FormProps, 'data' | 'setData'>): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState<Option[]>([]) // Manage selected options here

  const fetchOptions = async (inputValue: string): Promise<Option[]> => {
    if (inputValue.length < 2) return []

    const response = await fetch(`/intervention_areas?query=${encodeURIComponent(inputValue)}`)
    const data = await response.json()
    return data.map((data: { id: number, name: string }) => createOption(data))
  }

  // Use lodash's debounce to delay the API call
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
          '/intervention_areas',
          { name: inputValue },
          {
            headers: {
              'X-CSRF-Token': csrfToken
            }
          }
        )
        const newOption = createOption(response.data)
        setValue((prev) => [...prev, newOption]) // Add the new option to the state
        setData('osbls_intervention_areas_attributes', [...data.osbls_intervention_areas_attributes, { intervention_area_id: newOption.value }])
      } finally {
        setIsLoading(false)
      }
    })()
  }

  return (
    <AsyncCreatableSelect
      isMulti
      cacheOptions
      value={value} // Bind the external state to the select component
      loadOptions={promiseOptions}
      onCreateOption={handleCreate}
      onChange={(value) => {
        console.log('value', value)
        setValue(value as Option[])
        setData('osbls_intervention_areas_attributes', value.map((interventionArea: Option) => ({ intervention_area_id: interventionArea.value })))
      }}
      isDisabled={isLoading}
      isLoading={isLoading}
      classNames={{
        multiValueLabel: () => 'bg-secondary',
        multiValueRemove: () => 'bg-secondary'
      }}
      placeholder='pays, région, ...'
    />
  )
}
