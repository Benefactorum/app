import { ReactElement } from 'react'
import MyLink from '@/components/shared/MyLink'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu'
import { buttonVariants } from '@/components/ui/button'

// @ts-expect-error
import SearchIcon from '@/assets/icons/search.svg?react'
// @ts-expect-error
import FistIcon from '@/assets/icons/fist.svg?react'
// @ts-expect-error
import Facebook from '@/assets/icons/facebook.svg?react'
// @ts-expect-error
import Instagram from '@/assets/icons/instagram.svg?react'
// @ts-expect-error
import Github from '@/assets/icons/github.svg?react'
// @ts-expect-error
import Linkedin from '@/assets/icons/linkedin.svg?react'

const navLinks = [
  {
    title: 'Trouver une association',
    href: '/trouver-une-association',
    icon: SearchIcon
  },
  {
    title: 'Qui sommes-nous ?',
    href: '/qui-nous-sommes',
    icon: FistIcon
  }
]

const socialLinks = [
  {
    href: 'https://www.facebook.com/benefactorum/',
    icon: Facebook
  },
  {
    href: 'https://www.instagram.com/benefactorum_org/',
    icon: Instagram
  },
  {
    href: 'https://github.com/Benefactorum/app',
    icon: Github
  },
  {
    href: 'https://www.linkedin.com/company/benefactorum/',
    icon: Linkedin
  }
]

export default function Footer (): ReactElement {
  return (
    <footer className='flex flex-col bg-foreground text-white'>
      <div className='2xl:container 2xl:mx-auto flex flex-col lg:flex-row gap-8 items-center px-8 py-8 lg:py-2 justify-center sm:justify-between'>
        <MyLink href='/' className='flex gap-2 items-center'>
          <div className='text-right'>
            <h1 className='text-2xl sm:text-3xl font-bold leading-none sm:leading-none'>
              Benefactorum
            </h1>
            <h2 className='text-xs sm:text-sm leading-none sm:leading-none text-slate-200'>
              Association de bienfaiteurs
            </h2>
          </div>
        </MyLink>
        <NavigationMenu>
          <NavigationMenuList className='flex flex-col sm:flex-row gap-2 sm:gap-4 lg:gap-16'>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <MyLink
                    href={link.href}
                    className='flex gap-2 items-center hover:underline'
                  >
                    <link.icon className='invert' />
                    {link.title}
                  </MyLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className='flex items-center space-x-2'>
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className={`${buttonVariants({
                size: 'icon'
              })} bg-white w-6 h-6`}
            >
              <link.icon className='fill-foreground' />
            </a>
          ))}
        </div>
      </div>
      <p className='mx-auto flex text-center text-xs text-slate-200'>
        {new Date().getFullYear()} - &nbsp;
        <MyLink href='/mentions-legales' className='hover:underline'>
          Mentions légales
        </MyLink>
        &nbsp;-&nbsp;
        <MyLink href='/donnees-personnelles' className='hover:underline'>
          Données personnelles
        </MyLink>
      </p>
    </footer>
  )
}
