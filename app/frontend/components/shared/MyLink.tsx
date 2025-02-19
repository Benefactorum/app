import { Link, usePage } from '@inertiajs/react'
import { ComponentProps, ReactElement } from 'react'

type MyLinkProps = ComponentProps<typeof Link> & {
  disabled?: boolean
}

export default function MyLink ({ href, disabled = false, className, ...props }: MyLinkProps): ReactElement {
  const { url } = usePage()

  const handleBefore = (): boolean => {
    return !disabled && !(href === url)
  }

  return (
    <Link
      href={href}
      onBefore={handleBefore}
      className={`${className ?? ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    />
  )
}
