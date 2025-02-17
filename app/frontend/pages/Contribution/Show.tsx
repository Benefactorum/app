import { ReactElement } from 'react'
import { OsblUpdate } from '@/pages/Contribution/types'

interface Props {
  osbl: OsblUpdate
}

export default function Show ({ osbl }: Props): ReactElement {
  return (
    <div className='2xl:container mx-auto w-full flex flex-col px-2 sm:px-8 md:px-16 pt-8 pb-16 gap-8'>
      {/* Content will be added here later */}
    </div>
  )
}
