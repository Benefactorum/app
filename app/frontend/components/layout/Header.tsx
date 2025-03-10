import { router, usePage } from '@inertiajs/react'
import MyLink from '@/components/shared/MyLink'
import { ReactElement, useState, useEffect, useRef } from 'react'
import { Spin as Hamburger } from 'hamburger-react'
import {
  Search,
  CirclePlus,
  HeartHandshake,
  Bird,
  HandHeart,
  HandMetal,
  LogIn,
  LogOut
} from 'lucide-react'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

import Logo from '@/assets/logo.svg'

import type { CurrentUserType } from '@/types/types'

const subNavLinks = [
  {
    title: 'Nous rejoindre',
    href: '/nous-rejoindre',
    icon: HeartHandshake
  },
  {
    title: 'Notre équipe',
    href: '/co-fondateurs',
    icon: Bird
  }
]

const excludedPatterns = [/^\/connexion$/, /^\/se-connecter$/, /^\/s-inscrire$/]

export default function Header (): ReactElement {
  const [isOpen, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const { url } = usePage()
  const isExcluded = excludedPatterns.some((pattern) => pattern.test(url))

  const user = usePage().props.currentUser as CurrentUserType | null
  const sessionId = usePage().props.sessionId as string

  const handleLinkClick = (): void => {
    setOpen(false)
    setDropdownOpen(false)
  }

  // Handle click outside
  useEffect(() => {
    function handleClickOutside (event: MouseEvent): void {
      if (
        (headerRef.current != null) &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const logOut = (): void => {
    router.delete(`/sessions/${sessionId}`)
  }

  return (
    <header ref={headerRef} className='bg-white py-2 border-b'>
      <div
        id='mainHeader'
        className='2xl:container 2xl:mx-auto flex items-center px-2 justify-between'
      >
        <MyLink
          href='/'
          className='flex gap-2 items-center'
          onClick={handleLinkClick}
        >
          <img className='h-8 sm:h-12' src={Logo} alt='logo de Benefactorum' />
          <div className='text-right'>
            <h1 className='text-2xl sm:text-3xl font-bold leading-none sm:leading-none'>
              Benefactorum
            </h1>
            <h2 className='text-xs sm:text-sm leading-none sm:leading-none text-slate-600'>
              Association de bienfaiteurs
            </h2>
          </div>
        </MyLink>
        <NavigationMenu className='hidden min-[1100px]:flex'>
          <NavigationMenuList className='xl:gap-8'>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <MyLink
                  href='/'
                  className={
                    'flex gap-2 items-center py-2 px-4 rounded-md'
                    // (url === '/trouver-une-association'
                    //   ? ' bg-secondary'
                    //   : ' hover:bg-secondary/50')
                  }
                  onClick={handleLinkClick}
                  disabled
                >
                  <Search className='w-4 h-4 text-foreground' />
                  Trouver une association
                </MyLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {user != null && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <MyLink
                    href='/mes-contributions'
                    className={
                      'flex gap-2 items-center py-2 px-4 rounded-md' +
                      (url.startsWith('/mes-contributions')
                        ? ' bg-secondary'
                        : ' hover:bg-secondary/50')
                    }
                    onClick={handleLinkClick}
                  >
                    <HandHeart className='w-4 h-4 text-foreground' />
                    Mes contributions
                  </MyLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {user === null && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <MyLink
                    href='/qui-nous-sommes'
                    className={
                      'flex gap-2 items-center py-2 px-4 rounded-md' +
                      (url === '/qui-nous-sommes'
                        ? ' bg-secondary'
                        : ' hover:bg-secondary/50')
                    }
                    onClick={handleLinkClick}
                  >
                    <HandMetal className='w-4 h-4 text-foreground' />
                    Qui sommes-nous ?
                  </MyLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger className='py-2 px-4 rounded-md hover:bg-secondary/50 flex gap-2 items-center outline-none'>
                  <CirclePlus className='w-4 h-4 text-foreground' />
                  Plus
                </DropdownMenuTrigger>
                <DropdownMenuContent className='p-4 flex flex-col gap-2'>
                  {user !== null && (
                    <DropdownMenuItem className='focus:bg-white'>
                      <NavigationMenuLink asChild>
                        <MyLink
                          href='/qui-nous-sommes'
                          className={
                            'flex gap-2 items-centertext-base py-2 px-4 rounded-md' +
                            (url === '/qui-nous-sommes'
                              ? ' bg-secondary focus:bg-secondary'
                              : ' hover:bg-secondary/50 focus:bg-secondary/50')
                          }
                          onClick={handleLinkClick}
                        >
                          <HandMetal className='w-4 h-4 text-foreground' />
                          Qui sommes-nous ?
                        </MyLink>
                      </NavigationMenuLink>
                    </DropdownMenuItem>
                  )}
                  {subNavLinks.map((link) => (
                    <DropdownMenuItem key={link.href} className='focus:bg-white'>
                      <NavigationMenuLink asChild>
                        <MyLink
                          href={link.href}
                          className={
                            'flex gap-2 items-center text-base py-2 px-4 rounded-md w-full' +
                            (url === link.href
                              ? ' bg-secondary focus:bg-secondary'
                              : ' hover:bg-secondary/50 focus:bg-secondary/50')
                          }
                          onClick={handleLinkClick}
                        >
                          <link.icon className='text-foreground' />
                          {link.title}
                        </MyLink>
                      </NavigationMenuLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className='flex items-center space-x-4'>
          <div className='min-[1100px]:hidden'>
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
          <div className='hidden sm:flex'>
            {user === null && !isExcluded && (
              <MyLink href='/connexion' onClick={handleLinkClick}>
                <Button>
                  <LogIn />
                  Espace contributeur
                </Button>
              </MyLink>
            )}
            {user !== null && (
              <Button variant='secondary' onClick={logOut}>
                <LogOut className='text-foreground' />
                Se déconnecter
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown inside the header */}
      <div
        id='mobileDropdown'
        className={`min-[1100px]:hidden transition-all duration-700 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96' : 'max-h-0'
        } w-max mx-auto`}
      >
        <ul className='flex flex-col mt-4'>
          <li>
            <MyLink
              href='/trouver-une-association'
              className={
                'flex items-center justify-center gap-2 px-4 py-2 mb-2 rounded-md' +
                (url === '/trouver-une-association'
                  ? ' bg-secondary'
                  : ' hover:bg-secondary/50')
              }
              onClick={handleLinkClick}
            >
              <Search className='w-4 h-4 text-foreground' />
              Trouver une association
            </MyLink>
          </li>
          <li>
            <MyLink
              href='/qui-nous-sommes'
              className={
                'flex items-center justify-center gap-2 px-4 py-2 mb-2 rounded-md' +
                (url === '/qui-nous-sommes'
                  ? ' bg-secondary'
                  : ' hover:bg-secondary/50')
              }
              onClick={handleLinkClick}
            >
              <HandMetal className='w-4 h-4 text-foreground' />
              Qui sommes-nous ?
            </MyLink>
          </li>
          {user !== null && (
            <li>
              <MyLink
                href='/mes-contributions'
                className={
                  'flex items-center justify-center gap-2 px-4 py-2 mb-2 rounded-md' +
                  (url.startsWith('/mes-contributions')
                    ? ' bg-secondary'
                    : ' hover:bg-secondary/50')
                }
                onClick={handleLinkClick}
              >
                <HandHeart className='w-4 h-4 text-foreground' />
                Mes contributions
              </MyLink>
            </li>
          )}
          <hr className='border-t border-gray-300 my-2' />
          {subNavLinks.map((link) => (
            <li key={link.href}>
              <MyLink
                href={link.href}
                className={
                  'flex items-center justify-center gap-2 px-4 py-1 mb-1 rounded-md text-sm text-muted-foreground' +
                  (url === link.href
                    ? ' bg-secondary'
                    : ' hover:bg-secondary/50')
                }
                onClick={handleLinkClick}
              >
                <link.icon className='w-4 h-4 text-muted-foreground' />
                {link.title}
              </MyLink>
            </li>
          ))}
          {user === null && !isExcluded && (
            <>
              <hr className='border-t border-gray-300 my-2' />
              <li className='sm:hidden flex justify-center'>
                <div className='py-4 flex sm:hidden'>
                  <MyLink href='/connexion' onClick={handleLinkClick}>
                    <Button>
                      <LogIn />
                      Espace contributeur
                    </Button>
                  </MyLink>
                </div>
              </li>
            </>
          )}
          {user !== null && (
            <>
              <hr className='border-t border-gray-300 my-2' />
              <li className='sm:hidden flex justify-center'>
                <div className='py-4 flex sm:hidden'>
                  <Button variant='secondary' onClick={logOut}>
                    <LogOut className='text-foreground' />
                    Se déconnecter
                  </Button>
                </div>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  )
}
