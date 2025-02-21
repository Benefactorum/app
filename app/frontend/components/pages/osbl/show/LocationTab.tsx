import { NewOsbl } from '@/pages/Contribution/types'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import { Map, DivIcon } from 'leaflet'
import { Card } from '@/components/ui/card'
import { useState, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { MapIcon, ZoomInIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Props {
  osbl: NewOsbl
}

const FRANCE_CENTER = [46.603354, 1.888334] as [number, number]
const FRANCE_ZOOM = 5
const LOCATION_ZOOM = 13

interface BadgeAndMarkerProps {
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  markerClass: string
}

const getLocationTypeProps = (type: string): BadgeAndMarkerProps => {
  switch (type) {
    case 'Siège social':
      return {
        variant: 'destructive',
        markerClass: 'marker-siege'
      }
    case 'Antenne locale':
      return {
        variant: 'secondary',
        markerClass: 'marker-antenne'
      }
    case 'Lieu d\'activité':
      return {
        variant: 'outline',
        markerClass: 'marker-lieu'
      }
    default:
      return {
        variant: 'default',
        markerClass: 'marker-default'
      }
  }
}

const getMarkerIcon = (type: string, isActive: boolean): DivIcon => {
  const { markerClass } = getLocationTypeProps(type)
  return new DivIcon({
    className: `marker-base ${isActive ? 'marker-active' : markerClass}`,
    html: '<div class="marker-pin"></div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  })
}

export default function LocationTab ({ osbl }: Props): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [map, setMap] = useState<Map | null>(null)
  const locationRefs = useRef<Array<HTMLDivElement | null>>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  if (typeof osbl.locations_attributes?.length !== 'number' || osbl.locations_attributes.length === 0) {
    return (
      <div className='text-center text-muted-foreground py-4'>
        Aucune localisation n'a été renseignée.
      </div>
    )
  }

  const sortedLocations = useMemo(() => {
    return [...(osbl.locations_attributes ?? [])].sort((a, b) => {
      if (a.type === 'Siège social') return -1
      if (b.type === 'Siège social') return 1
      return (a.name ?? a.type).localeCompare(b.name ?? b.type)
    })
  }, [osbl.locations_attributes])

  const handleLocationSelect = (index: number): void => {
    if (selectedIndex === index) {
      setSelectedIndex(null)
      map?.flyTo(FRANCE_CENTER, FRANCE_ZOOM, { animate: true, duration: 1.5 })
    } else {
      setSelectedIndex(index)
      const location = sortedLocations[index]
      map?.flyTo(
        [Number(location.address_attributes.latitude), Number(location.address_attributes.longitude)],
        LOCATION_ZOOM,
        { animate: true, duration: 1.5 }
      )
    }
  }

  const handleMarkerHover = (index: number | null, fromMarker = false): void => {
    setHoveredIndex(index)
    if (index !== null && fromMarker) {
      const element = locationRefs.current[index]
      const container = scrollContainerRef.current
      if ((element != null) && (container != null)) {
        const containerRect = container.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        const containerScrollTop = container.scrollTop

        // Calculate the element's position relative to the container
        const elementRelativeTop = elementRect.top - containerRect.top + containerScrollTop

        // Calculate the center position
        const containerCenter = (containerRect.height - elementRect.height) / 2
        const scrollPosition = elementRelativeTop - containerCenter

        // Smooth scroll the container
        container.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:h-[500px]'>
      <Card className='max-h-[200px] md:max-h-full overflow-hidden border-0 shadow-none'>
        <div className='flex flex-col h-full gap-4'>
          <div>
            <div className='flex justify-between items-center h-10 gap-2 mx-2 sm:mx-0'>
              <h3 className='text-lg font-semibold'>Localisations</h3>
              {selectedIndex !== null && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleLocationSelect(selectedIndex)}
                  className='flex items-center gap-2 flex-wrap'
                >
                  <MapIcon className='h-4 w-4' />
                  <span className='hidden sm:block'>Réinitialiser la carte</span>
                </Button>
              )}
            </div>
          </div>
          <div className='flex-1 overflow-y-auto' ref={scrollContainerRef}>
            <div className='space-y-2'>
              {sortedLocations.map((location, index) => (
                <div
                  key={index}
                  ref={el => { locationRefs.current[index] = el }}
                  className={`p-3 transition-colors rounded cursor-pointer relative group
                    ${selectedIndex === index ? 'bg-background' : ''}
                    ${hoveredIndex === index ? 'bg-background/50' : ''}
                    hover:bg-background/50`}
                  onClick={() => handleLocationSelect(index)}
                  onMouseEnter={() => handleMarkerHover(index)}
                  onMouseLeave={() => handleMarkerHover(null)}
                >
                  <div className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <ZoomInIcon className='h-4 w-4 text-muted-foreground' />
                  </div>
                  <div className='pr-6'>
                    <div className='font-medium flex items-center gap-2'>
                      {location.name ?? `${location.type.charAt(0).toUpperCase()}${location.type.slice(1)}`}
                      <Badge variant={getLocationTypeProps(location.type).variant}>
                        {location.type}
                      </Badge>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {location.address_attributes.street_number} {location.address_attributes.street_name}
                      {typeof location.address_attributes.additional_info === 'string' &&
                       location.address_attributes.additional_info.length > 0 && (
                         <div>{location.address_attributes.additional_info}</div>
                      )}
                      <div>
                        {location.address_attributes.postal_code} • {location.address_attributes.city}
                      </div>
                    </div>
                    {typeof location.description === 'string' &&
                     location.description.length > 0 && (
                       <div className='mt-2 text-sm'>{location.description}</div>
                    )}
                    {typeof location.website === 'string' &&
                     location.website.length > 0 && (
                       <a
                         href={location.website}
                         target='_blank'
                         rel='noreferrer'
                         className='text-sm text-primary hover:underline mt-2 block'
                       >
                         Site web
                       </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className='min-h-[320px] md:h-full overflow-hidden'>
        <MapContainer
          center={FRANCE_CENTER}
          zoom={FRANCE_ZOOM}
          className='h-full w-full'
          ref={setMap}
          dragging={selectedIndex === null}
          zoomControl={selectedIndex === null}
          scrollWheelZoom={selectedIndex === null}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {sortedLocations.map((location, index) => (
            <Marker
              key={index}
              position={{
                lat: Number(location.address_attributes.latitude),
                lng: Number(location.address_attributes.longitude)
              }}
              icon={getMarkerIcon(
                location.type,
                selectedIndex === index || hoveredIndex === index
              )}
              eventHandlers={{
                click: () => handleLocationSelect(index),
                mouseover: () => handleMarkerHover(index, true),
                mouseout: () => handleMarkerHover(null)
              }}
            >
              <Tooltip direction='top' offset={[0, -20]} permanent={selectedIndex === index}>
                {location.name ?? `${location.type.charAt(0).toUpperCase()}${location.type.slice(1)}`}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </Card>
    </div>
  )
}
