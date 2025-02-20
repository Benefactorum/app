import { ReactElement } from 'react'
import { Button } from '@/components/ui/button'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { SheetTrigger } from '@/components/ui/sheet'

interface SheetTriggerItemProps {
  displayName: string
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function SheetTriggerItem ({ displayName, onRemove }: SheetTriggerItemProps): ReactElement {
  return (
    <div className='flex items-center justify-between p-4 border rounded-lg bg-white overflow-auto'>
      <p>{displayName}</p>
      <div className='flex gap-2'>
        <SheetTrigger asChild>
          <Button 
            variant='outline' 
            className='bg-white text-primary border-none'
            aria-label={`Edit ${displayName}`}
          >
            <PencilIcon />
          </Button>
        </SheetTrigger>
        <Button
          onClick={onRemove}
          variant='outline'
          className='bg-white text-red-600 border-none'
          aria-label={`Delete ${displayName}`}
        >
          <TrashIcon className='w-4 h-4' />
        </Button>
      </div>
    </div>
  )
}
