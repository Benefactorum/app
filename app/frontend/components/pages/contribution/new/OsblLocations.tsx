import { ReactElement } from 'react'
import { FormProps, Location } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import { PlusIcon, TrashIcon, ChevronDown } from 'lucide-react'
import MyInput from '@/components/forms/MyInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import MyAsyncSelect from '@/components/shared/MyAsyncSelect'

const LocationTypeList = [
  { value: 'siege_social', label: 'Siège social' },
  { value: 'antenne_locale', label: 'Antenne locale' },
  { value: 'lieu_d_activite', label: 'Lieu d\'activité' },
  { value: 'autre', label: 'Autre' }
]

export default function OsblLocations ({ data, setData }: Pick<FormProps, 'data' | 'setData'>): ReactElement {
  const locations = data.locations_attributes ?? []

  const hasSiegeSocial = locations.some(loc => loc.type === 'siege_social')

  function handleLocationChange (
    index: number,
    field: keyof Location,
    value: Location[typeof field]
  ): void {
    const updatedLocations = locations.map((loc, i: number) =>
      i === index
        ? {
            ...loc,
            [field]: value
          }
        : loc
    )

    setData('locations_attributes', updatedLocations)
  }

  function handleAddressChange (index: number, value: any, field?: string): void {
    const updatedLocations = locations.map((loc, i) =>
      i === index
        ? {
            ...loc,
            address_attributes: field != null
              ? { ...loc.address_attributes, [field]: value }
              : value
          }
        : loc
    )
    setData('locations_attributes', updatedLocations)
  }

  function handleLocationAdd (e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    setData('locations_attributes', [...locations, {}])
  }

  function handleLocationRemove (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ): void {
    e.preventDefault()
    const updatedDocuments = locations.filter((_, i) => i !== index)
    setData('locations_attributes', updatedDocuments)
  }

  return (
    <div className='bg-white rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col w-full h-full'>
      <div className='flex items-center gap-4 justify-between flex-wrap'>
        <h2 className='text-2xl font-semibold w-[145px]'>Lieux</h2>
        <Button onClick={handleLocationAdd} variant='outline'>
          <PlusIcon className='w-4 h-4' />
          <span className='ml-2 hidden sm:block lg:hidden xl:block'>Ajouter</span>
        </Button>
      </div>

      {locations.length > 0 && (
        <div className='flex flex-col gap-4'>
          {locations.map((loc, index) => (
            <Card
              key={`location-${loc.type ?? 'new'}-${index}`}
              className='bg-background'
            >
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-16 flex-1'>
                  <Select
                    value={loc.type}
                    onValueChange={(value) => handleLocationChange(index, 'type', value)}
                    required
                  >
                    <SelectTrigger className='w-60 data-[placeholder]:text-muted-foreground'>
                      <SelectValue placeholder='Type de lieu *' />
                    </SelectTrigger>
                    <SelectContent>
                      {LocationTypeList
                        .filter(type =>
                          type.value !== 'siege_social' || !hasSiegeSocial || loc.type === 'siege_social'
                        )
                        .map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={(e) => handleLocationRemove(e, index)}
                    variant='ghost'
                    className='text-red-500 hover:text-red-700 p-0 h-auto'
                  >
                    <TrashIcon className='w-4 h-4' />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className='flex flex-col gap-4'>
                <MyAsyncSelect
                  setData={(_, value) => handleAddressChange(index, value)}
                  attributeName='address_attributes'
                  placeholder='Adresse *'
                  required
                />

                <Collapsible>
                  <CollapsibleTrigger className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'>
                    <ChevronDown className='h-4 w-4' />
                    Informations additionnelles
                  </CollapsibleTrigger>

                  <CollapsibleContent className='space-y-4 pt-4'>
                    <MyInput
                      type='text'
                      id={`location-name-${index}`}
                      value={loc.name ?? ''}
                      onChange={(e) => handleLocationChange(index, 'name', e.target.value)}
                      placeholder='Nom du lieu'
                    />

                    <MyInput
                      type='text'
                      id={`location-additional-address-info-${index}`}
                      value={loc.address_attributes?.additional_info ?? ''}
                      onChange={(e) => handleAddressChange(index, e.target.value, 'additional_info')}
                      placeholder="Complément d'adresse"
                    />

                    <MyInput
                      type='url'
                      id={`location-website-${index}`}
                      value={loc.website ?? ''}
                      onChange={(e) => handleLocationChange(index, 'website', e.target.value)}
                      placeholder='Site web'
                    />

                    <div className='flex flex-col gap-2'>
                      <Textarea
                        id={`location-description-${index}`}
                        placeholder='Description du lieu'
                        value={loc.description?.toString() ?? ''}
                        onChange={(e) => handleLocationChange(index, 'description', e.target.value)}
                        className='bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-full h-40'
                      />
                      <div className={`text-xs text-right ${(loc.description?.toString().length ?? 0) > 300 ? 'text-red-600' : 'text-gray-500'}`}>
                        {(loc.description?.toString().length ?? 0)}/300 caractères
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
