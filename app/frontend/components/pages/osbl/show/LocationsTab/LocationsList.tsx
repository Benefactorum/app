import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MapIcon } from 'lucide-react'
import { Location } from '@/pages/Contribution/types'
import { LocationItemContent } from './LocationsList/LocationItemContent'

interface LocationsListProps {
  locations: Location[]
  selectedIndex: number | null
  hoveredIndex: number | null
  onLocationSelect: (index: number) => void
  onLocationHover: (index: number | null) => void
  locationRefs: React.RefObject<Array<HTMLDivElement | null>>
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

export function LocationsList ({
  locations,
  selectedIndex,
  hoveredIndex,
  onLocationSelect,
  onLocationHover,
  locationRefs,
  scrollContainerRef
}: LocationsListProps): React.ReactElement {
  return (
    <Card className='max-h-[200px] md:max-h-full overflow-hidden border-0 shadow-none'>
      <div className='flex flex-col h-full gap-4'>
        <div>
          <div className='flex justify-between items-center h-10 gap-2 mx-2 sm:mx-0'>
            <h3 className='text-lg font-semibold'>Localisations</h3>
            {selectedIndex !== null && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => onLocationSelect(selectedIndex)}
                className='flex items-center gap-2 flex-wrap'
              >
                <MapIcon className='h-4 w-4' />
                <span className='hidden sm:block'>Réinitialiser la carte</span>
              </Button>
            )}
          </div>
        </div>
        <div className='flex-1 overflow-y-auto' ref={scrollContainerRef}>
          {locations.length === 0
            ? (
              <div className='text-center text-muted-foreground p-4'>
                Aucune localisation n'a été renseignée.
              </div>
              )
            : (
              <div className='space-y-2'>
                {locations.map((location, index) => (
                  <div
                    key={index}
                    ref={el => { locationRefs.current[index] = el }}
                    className={`p-3 transition-colors rounded cursor-pointer relative group
                    ${selectedIndex === index ? 'bg-background' : ''}
                    ${hoveredIndex === index ? 'bg-background/50' : ''}
                    hover:bg-background/50`}
                    onClick={() => onLocationSelect(index)}
                    onMouseEnter={() => onLocationHover(index)}
                    onMouseLeave={() => onLocationHover(null)}
                  >
                    <LocationItemContent
                      location={location}
                      isSelected={selectedIndex === index}
                    />
                  </div>
                ))}
              </div>
              )}
        </div>
      </div>
    </Card>
  )
}
