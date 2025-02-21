import { NewOsbl, Location } from '@/pages/Contribution/types'
import 'leaflet/dist/leaflet.css'
import { Map } from 'leaflet'
import { useState, useRef } from 'react'
import { LocationsList } from './LocationTab/LocationsList'
import { OsblMap } from './LocationTab/OsblMap'
import { useLocationInteractions } from './LocationTab/useLocationInteractions'

interface Props {
  osbl: NewOsbl
}

const FRANCE_CENTER = [46.603354, 1.888334] as [number, number]
const FRANCE_ZOOM = 5
const LOCATION_ZOOM = 13

function sortLocations (locations: Location[]): Location[] {
  return [...locations].sort((a, b) => {
    if (a.type === 'Siège social') return -1
    if (b.type === 'Siège social') return 1
    return (a.name ?? a.type).localeCompare(b.name ?? b.type)
  })
}

export default function LocationTab ({ osbl }: Props): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [map, setMap] = useState<Map | null>(null)
  const locationRefs = useRef<Array<HTMLDivElement | null>>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const sortedLocations = sortLocations(osbl.locations_attributes ?? [])

  const { handleLocationSelect, handleMarkerHover } = useLocationInteractions({
    selectedIndex,
    setSelectedIndex,
    setHoveredIndex,
    map,
    locationRefs,
    scrollContainerRef,
    sortedLocations,
    FRANCE_CENTER,
    FRANCE_ZOOM,
    LOCATION_ZOOM
  })

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:h-[500px]'>
      <LocationsList
        locations={sortedLocations}
        selectedIndex={selectedIndex}
        hoveredIndex={hoveredIndex}
        onLocationSelect={handleLocationSelect}
        onLocationHover={handleMarkerHover}
        locationRefs={locationRefs}
        scrollContainerRef={scrollContainerRef}
      />

      <OsblMap
        locations={sortedLocations}
        selectedIndex={selectedIndex}
        hoveredIndex={hoveredIndex}
        onLocationSelect={handleLocationSelect}
        onMarkerHover={handleMarkerHover}
        setMap={setMap}
        mapCenter={FRANCE_CENTER}
        mapZoom={FRANCE_ZOOM}
      />
    </div>
  )
}
