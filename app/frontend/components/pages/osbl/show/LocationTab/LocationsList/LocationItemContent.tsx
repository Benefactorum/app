import { Badge } from '@/components/ui/badge'
import { Location } from '@/pages/Contribution/types'
import { capitalize } from '@/lib/utils'
import { ZoomInIcon } from 'lucide-react'

function getLocationBadgeVariant (type: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (type) {
    case 'Siège social':
      return 'destructive'
    case 'Antenne locale':
      return 'secondary'
    case "Lieu d'activité":
      return 'default'
    default:
      return 'outline'
  }
}

interface LocationItemContentProps {
  location: Location
}

export function LocationItemContent ({ location }: LocationItemContentProps): React.ReactElement {
  const address = location.address_attributes
  return (
    <>
      <div className='pr-6'>
        <div className='font-medium flex items-center gap-2'>
          {location.name !== undefined ? capitalize(location.name) : location.type}
          <Badge variant={getLocationBadgeVariant(location.type)}>
            {location.type}
          </Badge>
        </div>
        <div className='text-sm text-muted-foreground'>
          {address.street_number} {address.street_name}
          {typeof address.additional_info === 'string' &&
            address.additional_info.length > 0 && (
              <div>{address.additional_info}</div>
          )}
          <div>
            {address.postal_code} • {address.city}
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
      <div className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'>
        <ZoomInIcon className='h-4 w-4 text-muted-foreground' />
      </div>
    </>
  )
}
