import { ReactNode, ReactElement } from 'react'
import { CircleHelp } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface HelpTooltipProps {
  children: ReactNode
  size?: 'small' | 'large'
}

export default function HelpTooltip ({
  children,
  size = 'large'
}: HelpTooltipProps): ReactElement {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <CircleHelp className='inline-block w-4 h-4 text-primary' />
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            'flex flex-col gap-2 border-secondary',
            size === 'small' ? 'p-2' : 'p-4'
          )}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
