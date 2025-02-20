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
  className?: string
}

export default function HelpTooltip ({
  children,
  className
}: HelpTooltipProps): ReactElement {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={(e) => {
          e.preventDefault()
        }}
        >
          <CircleHelp className={cn('inline-block w-4 h-4 text-primary', className)} />
        </TooltipTrigger>
        <TooltipContent
          className={cn('flex flex-col gap-2 p-2 sm:p-4 max-w-[320px]')}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
