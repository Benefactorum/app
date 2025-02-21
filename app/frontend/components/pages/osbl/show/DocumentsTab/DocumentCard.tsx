import { Document, FileAsObject } from '@/pages/Contribution/types'
import { FileTextIcon } from 'lucide-react'
import HelpTooltip from '@/components/shared/HelpTooltip'
interface Props {
  document: {
    document_attributes: Document
  }
}

export default function DocumentCard ({ document }: Props): React.ReactElement {
  const { type, file, name, year, description } = document.document_attributes

  return (
    <div className='p-4 border rounded-lg shadow-sm transition-shadow bg-background/50 mb-4 gap-2'>
      <div className='flex items-center justify-between flex-wrap gap-2'>
        <a
          href={(file as FileAsObject).url}
          target='_blank'
          className='flex items-center cursor-pointer hover:text-primary'
          aria-label={`Open ${name ?? type} document`}
          rel='noopener noreferrer'
        >
          <FileTextIcon className='w-4 h-4 mr-2 flex-shrink-0' />
          <p className='text-sm font-medium break-words'>{name ?? type}</p>
        </a>
        <div className='flex items-center gap-2 flex-shrink-0'>
          {year !== undefined && <p className='text-sm text-muted-foreground mt-1'>{year}</p>}
          {description !== undefined && (
            <HelpTooltip>
              <p className='text-sm'>{description}</p>
            </HelpTooltip>
          )}
        </div>
      </div>
    </div>
  )
}
