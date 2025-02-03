import { ReactElement, useRef, useState } from 'react'
import { Location } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import MyInput from '@/components/forms/MyInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckIcon, ChevronDown, X } from 'lucide-react'
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import MyAsyncSelect from '@/components/shared/MyAsyncSelect'
import deepCleanData from '@/lib/deepCleanData'
import { LocationTypeList } from '@/lib/constants'
import { Label } from '@/components/ui/label'

interface Props {
  location: Partial<Location>
  index: number
  onUpdate: (location: Location) => void
  hasSiegeSocial: boolean
}

export default function OsblLocationSheet ({
  location,
  index,
  onUpdate,
  hasSiegeSocial
}: Props): ReactElement {
  const formRef = useRef<HTMLFormElement>(null)
  const [sheetLocation, setSheetLocation] = useState<Partial<Location>>(location)
  const [isOpen, setIsOpen] = useState(() => {
    const checks = [
      sheetLocation.name !== undefined,
      sheetLocation.address_attributes?.additional_info !== undefined,
      sheetLocation.website !== undefined,
      sheetLocation.description !== undefined
    ]
    return checks.some(check => check)
  })

  function updateSheetLocation (field: keyof Location, value: any): void {
    setSheetLocation(prev => ({
      ...prev,
      [field]: value
    }))
  }

  function handleAddressChange (value: any, field?: string): void {
    setSheetLocation(prev => ({
      ...prev,
      address_attributes: field != null
        ? { ...prev.address_attributes, [field]: value }
        : value
    }))
  }

  function handleSubmit (e: React.MouseEvent<HTMLButtonElement>): void {
    if (formRef.current?.reportValidity() === false) {
      e.preventDefault()
      return
    }

    onUpdate(deepCleanData(sheetLocation))
  }

  function getLabel (): string {
    return [
      sheetLocation.address_attributes?.street_number,
      sheetLocation.address_attributes?.street_name,
      sheetLocation.address_attributes?.postal_code,
      sheetLocation.address_attributes?.city
    ].filter(Boolean).join(' ')
  }

  return (
    <SheetContent className='w-full sm:max-w-[600px] overflow-y-auto'>
      <form ref={formRef}>
        <SheetHeader>
          <SheetTitle>Lieu</SheetTitle>
          <SheetDescription className='sr-only'>
            Renseignez les informations du lieu.
          </SheetDescription>
        </SheetHeader>

        <div className='flex flex-col gap-8 mt-8'>
          <div className='flex flex-col gap-4'>
            <Label>Type de lieu *</Label>
            <Select
              value={sheetLocation.type}
              onValueChange={(value) => updateSheetLocation('type', value)}
              required
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LocationTypeList
                  .filter(type =>
                    type.value !== 'siege_social' || !hasSiegeSocial || location.type === 'siege_social'
                  )
                  .map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {['antenne_locale', 'lieu_d_activite', 'autre'].includes(sheetLocation.type ?? '') && (
            <MyInput
              labelText='Nom du lieu *'
              id={`location-name-${index}`}
              type='text'
              value={sheetLocation.name ?? ''}
              onChange={(e) => updateSheetLocation('name', e.target.value)}
              required
            />
          )}

          <div className='flex flex-col gap-4'>
            <Label>Adresse *</Label>
            <MyAsyncSelect
              setData={(_, value) => handleAddressChange(value)}
              attributeName='address_attributes'
              required
              value={getLabel()}
            />
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <div className='flex justify-between items-center cursor-pointer text-muted-foreground hover:text-muted-foreground/80'>
                <span>Informations additionnelles</span>
                <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className='CollapsibleContent'>
              <div className='flex flex-col gap-8 mt-8'>
                {sheetLocation.type === 'siege_social' && (
                  <MyInput
                    labelText='Nom du lieu'
                    id={`location-name-${index}`}
                    type='text'
                    value={sheetLocation.name ?? ''}
                    onChange={(e) => updateSheetLocation('name', e.target.value)}
                  />
                )}

                <MyInput
                  labelText="Complément d'adresse"
                  type='text'
                  id={`location-additional-address-info-${index}`}
                  value={sheetLocation.address_attributes?.additional_info ?? ''}
                  onChange={(e) => handleAddressChange(e.target.value, 'additional_info')}
                />

                <MyInput
                  labelText='Site web'
                  type='url'
                  id={`location-website-${index}`}
                  value={sheetLocation.website ?? ''}
                  onChange={(e) => updateSheetLocation('website', e.target.value)}
                />

                <div className='flex flex-col gap-4'>
                  <label htmlFor={`location-description-${index}`} className='text-sm font-medium'>
                    Description du lieu
                  </label>
                  <Textarea
                    id={`location-description-${index}`}
                    value={sheetLocation.description ?? ''}
                    maxLength={300}
                    onChange={(e) => updateSheetLocation('description', e.target.value)}
                    className='bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-full h-40'
                  />
                  <div className='text-xs text-right'>
                    {sheetLocation.description?.length ?? 0}/300 caractères
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <SheetFooter className='mt-16 gap-y-2'>
          <SheetClose asChild>
            <Button variant='ghost' size='lg'>
              <X className='mr-2' />
              Annuler
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button onClick={handleSubmit} variant='default' size='lg'>
              <CheckIcon className='mr-2' />
              Valider
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  )
}
