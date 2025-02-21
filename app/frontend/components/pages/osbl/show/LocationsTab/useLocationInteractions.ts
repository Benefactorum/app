import { useCallback } from 'react'
import { Map } from 'leaflet'
import { Location } from '@/pages/Contribution/types'

interface UseLocationInteractionsProps {
  selectedIndex: number | null
  setSelectedIndex: (index: number | null) => void
  setHoveredIndex: (index: number | null) => void
  map: Map | null
  locationRefs: React.RefObject<Array<HTMLDivElement | null>>
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  sortedLocations: Location[]
  FRANCE_CENTER: [number, number]
  FRANCE_ZOOM: number
  LOCATION_ZOOM: number
}

export function useLocationInteractions ({
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
}: UseLocationInteractionsProps): {
    handleLocationSelect: (index: number) => void
    handleMarkerHover: (index: number | null, fromMarker?: boolean) => void
  } {
  const handleLocationSelect = useCallback((index: number): void => {
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
  }, [selectedIndex, map, sortedLocations])

  const handleMarkerHover = useCallback((index: number | null, fromMarker = false): void => {
    setHoveredIndex(index)
    if (index !== null && fromMarker) {
      const element = locationRefs.current[index]
      const container = scrollContainerRef.current
      if ((element != null) && (container != null)) {
        const containerRect = container.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        const containerScrollTop = container.scrollTop

        const elementRelativeTop = elementRect.top - containerRect.top + containerScrollTop
        const containerCenter = (containerRect.height - elementRect.height) / 2
        const scrollPosition = elementRelativeTop - containerCenter

        container.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        })
      }
    }
  }, [])

  return {
    handleLocationSelect,
    handleMarkerHover
  }
}
