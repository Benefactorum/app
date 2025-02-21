import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import { Map, DivIcon } from 'leaflet'
import { Card } from '@/components/ui/card'
import { Location } from '@/pages/Contribution/types'
import { capitalize } from '@/lib/utils'

interface OsblMapProps {
  locations: Location[]
  selectedIndex: number | null
  hoveredIndex: number | null
  onLocationSelect: (index: number) => void
  onMarkerHover: (index: number | null, fromMarker?: boolean) => void
  setMap: (map: Map) => void
  mapCenter: [number, number]
  mapZoom: number
}

function getLocationMarkerClass (type: string): string {
  switch (type) {
    case 'Siège social':
      return 'marker-siege'
    case 'Antenne locale':
      return 'marker-antenne'
    case "Lieu d'activité":
      return 'marker-default'
    default:
      return 'marker-lieu'
  }
}

function getMarkerIcon (type: string, isActive: boolean): DivIcon {
  const markerClass = getLocationMarkerClass(type)
  return new DivIcon({
    className: `marker-base ${isActive ? 'marker-active' : markerClass}`,
    html: '<div class="marker-pin"></div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  })
}

export function OsblMap ({
  locations,
  selectedIndex,
  hoveredIndex,
  onLocationSelect,
  onMarkerHover,
  setMap,
  mapCenter,
  mapZoom
}: OsblMapProps): React.ReactElement {
  return (
    <Card className='min-h-[320px] md:h-full overflow-hidden'>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
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
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{
              lat: location.address_attributes.latitude,
              lng: location.address_attributes.longitude
            }}
            icon={getMarkerIcon(
              location.type,
              selectedIndex === index || hoveredIndex === index
            )}
            eventHandlers={{
              click: () => onLocationSelect(index),
              mouseover: () => onMarkerHover(index, true),
              mouseout: () => onMarkerHover(null)
            }}
          >
            <Tooltip direction='top' offset={[0, -20]} permanent={selectedIndex === index}>
              {location.name !== undefined ? capitalize(location.name) : location.type}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  )
}
