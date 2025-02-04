import { ReactElement, useCallback } from 'react'
import AsyncSelect from 'react-select/async'
import debounce from 'lodash.debounce'
import { Address } from '@/pages/Contribution/types'

interface AddressApiResponse {
  features: AddressFeature[]
}

interface AddressFeature {
  properties: {
    label: string
    housenumber: string
    street: string
    postcode: string
    city: string
  }
  geometry: {
    coordinates: [number, number]
  }
}

interface Option {
  readonly label: string
  readonly value: Address
}

interface MyAsyncCreatableSelectProps {
  setData: (key: string, value: any) => void
  attributeName: string
  minInputLength?: number
  placeholder?: string
  required?: boolean
  value: string | undefined
}

const createOption = (feature: AddressFeature): Option => ({
  label: feature.properties.label,
  value: {
    street_number: feature.properties.housenumber,
    street_name: feature.properties.street,
    postal_code: feature.properties.postcode,
    city: feature.properties.city,
    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0]
  }
})

export default function MyAsyncCreatableSelect ({
  setData,
  attributeName,
  minInputLength = 3,
  placeholder,
  required = false,
  value
}: MyAsyncCreatableSelectProps): ReactElement {
  const fetchOptions = async (inputValue: string): Promise<Option[]> => {
    if (inputValue.trim().length < minInputLength) return []

    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${inputValue}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch addresses: ${inputValue} / ${response.statusText}`)
      }
      const data = await response.json() as AddressApiResponse
      return data.features.map((feature: AddressFeature) => createOption(feature))
    } catch (error) {
      console.error(error)
      return []
    }
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

  return (
    <AsyncSelect
      required={required && value === undefined}
      loadOptions={promiseOptions}
      onChange={(newValue: Option | null) => {
        if (newValue === null) return
        setData(attributeName, newValue.value)
      }}
      defaultInputValue={value}
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
        placeholder: (base) => ({
          ...base,
          fontSize: '0.875rem'
        })
      }}
      placeholder={placeholder}
      loadingMessage={() => 'Recherche...'}
      noOptionsMessage={() => 'Aucune suggestion'}
    />
  )
}
