import { ReactElement } from 'react'
import { FormProps, Location } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import {
  Sheet,
  SheetTrigger
} from '@/components/ui/sheet'
import OsblLocationSheet from '@/components/pages/contribution/new/OsblLocations/OsblLocationSheet'
import SheetTriggerItem from '@/components/pages/contribution/new/common/SheetTriggerItem'

export default function OsblLocations ({ data, setData }: Pick<FormProps, 'data' | 'setData'>): ReactElement {
  const locations = data.locations_attributes ?? []
  const hasSiegeSocial = locations.some(loc => loc.type === 'Siège social')

  function addLocation (location: Location, index: number): void {
    const updatedLocations = [...locations]
    updatedLocations[index] = location

    setData('locations_attributes', updatedLocations)
  }

  function handleLocationRemove (e: React.MouseEvent<HTMLButtonElement>, index: number): void {
    e.preventDefault() // prevent the form from being submitted
    setData('locations_attributes', locations.filter((_, i) => i !== index))
  }

  function getLocationDisplayName (location: Location): string {
    if (location.name !== undefined) return location.name

    return location.type
  }

  return (
    <div className='bg-white rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col w-full h-full'>
      <div className='flex flex-wrap gap-4 items-center justify-between'>
        <h2 className='text-2xl font-semibold w-[145px]'>Lieux</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline'>
              <PlusIcon className='w-4 h-4' />
              <span className='ml-2 hidden sm:block lg:hidden xl:block'>Ajouter</span>
            </Button>
          </SheetTrigger>
          <OsblLocationSheet
            key={`location-${locations.length}`}
            location={{}}
            index={locations.length}
            onUpdate={(loc) => addLocation(loc, locations.length)}
            hasSiegeSocial={hasSiegeSocial}
          />
        </Sheet>
      </div>

      {locations.length > 0 && (
        <div className='flex flex-col gap-4'>
          {locations.map((loc, index) => (
            <Sheet key={`location-${index}`}>
              <SheetTriggerItem
                displayName={getLocationDisplayName(loc)}
                onRemove={(e) => handleLocationRemove(e, index)}
              />

              <OsblLocationSheet
                location={loc}
                index={index}
                onUpdate={(loc) => addLocation(loc, index)}
                hasSiegeSocial={hasSiegeSocial}
              />
            </Sheet>
          ))}
        </div>
      )}
    </div>
  )
}
