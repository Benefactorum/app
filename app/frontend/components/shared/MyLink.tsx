import { Link, usePage } from '@inertiajs/react'
import { ComponentProps, ReactElement } from 'react'

type MyLinkProps = ComponentProps<typeof Link>

export default function MyLink ({ href, ...props }: MyLinkProps): ReactElement {
  const { url } = usePage()

  const handleBefore = (): boolean => {
    return !(href === url)
  }

  return <Link href={href} onBefore={handleBefore} {...props} />
}
