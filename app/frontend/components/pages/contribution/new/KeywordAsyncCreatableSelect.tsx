import { ReactElement, useState } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable' // https://react-select.com/home#welcome
import axios from 'axios'
import { FormProps } from '@/pages/Contribution/types'

interface Option {
  readonly label: string
  readonly value: string
}

const createOption = (data: { id: number, name: string }): Option => ({
  label: data.name,
  value: String(data.id)
})

export default function KeywordAsyncCreatableSelect ({
  data,
  setData,
  errors,
  clearErrors
}: FormProps): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState<Option[]>([]) // Manage selected options here

  const promiseOptions = async (inputValue: string): Promise<Option[]> => {
    if (inputValue.length < 3) return []

    const response = await fetch(`/keywords?query=${encodeURIComponent(inputValue)}`)
    const data = await response.json()
    return data.map((data: { id: number, name: string }) => createOption(data))
  }

  const handleCreate = (inputValue: string): void => {
    void (async () => {
      setIsLoading(true)
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        const response = await axios.post(
          '/keywords',
          { name: inputValue },
          {
            headers: {
              'X-CSRF-Token': csrfToken
            }
          }
        )
        const newOption = createOption(response.data)
        setValue((prev) => [...prev, newOption]) // Add the new option to the state
        setData('new_keywords', [...value.map((v) => v.value), newOption.value]) // Update parent data
        clearErrors('new_keywords') // Clear errors if any
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
        setValue(value)
        // setData('new_keywords', value.map(keyword => keyword.value))
        // clearErrors('new_keywords')
      }}
      isDisabled={isLoading}
      isLoading={isLoading}
      classNames={{
        multiValueLabel: () => 'bg-secondary',
        multiValueRemove: () => 'bg-secondary'
      }}
      placeholder='droits des femmes, ...'
    />
  )
}
