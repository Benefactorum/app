import { ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import NoProfilePicture from '@/assets/images/user/no-profile-picture.svg'
import UserAvatarEdit from '@/components/pages/user/show/UserAvatarEdit'
import { Settings } from 'lucide-react'
// @ts-expect-error
import Facebook from '@/assets/icons/facebook.svg?react'
// @ts-expect-error
import Instagram from '@/assets/icons/instagram.svg?react'
// @ts-expect-error
import Github from '@/assets/icons/github.svg?react'
// @ts-expect-error
import Linkedin from '@/assets/icons/linkedin.svg?react'
import FormattedDate from '@/lib/formattedDate'
import { buttonVariants } from '@/components/ui/button'

import type { CurrentUserType, ProfilePictureUrlType } from '@/types/types'

const socialLinks = [
  {
    href: '',
    icon: Facebook
  },
  {
    href: '',
    icon: Instagram
  },
  {
    href: '',
    icon: Github
  },
  {
    href: '',
    icon: Linkedin
  }
]

interface UserType {
  id: number
  first_name: string
  last_name: string
  created_at: string
}

interface UserShowProps {
  user: UserType
  currentUser: CurrentUserType
  profile_picture_url: ProfilePictureUrlType
}

export default function Show ({
  user,
  profile_picture_url, // eslint-disable-line
  currentUser
}: UserShowProps): ReactElement {
  return (
    <>
      <Head>
        <title>Tableau de bord</title>
        <meta name='description' content='Your page description' />
      </Head>
      <div className='w-full mx-auto flex flex-wrap py-8 lg:py-16 2xl:container px-2 sm:px-8 gap-8'>
        <div className='mx-auto relative flex justify-center items-center'>
          <img
            alt='avatar de profil'
            className='w-[212px] h-[212px] rounded-full object-cover'
            src={profile_picture_url ?? NoProfilePicture}
          />
          {user.id === currentUser.id && (
            <UserAvatarEdit
              userId={user.id}
              hasProfilePicture={profile_picture_url !== null}
            />
          )}
        </div>
        <div className='mx-auto flex'>
          <div className='mx-auto flex flex-col justify-center gap-4'>
            <div className='flex flex-col gap-4 md:flex-row'>
              <h1 className=' text-2xl sm:text-3xl lg:text-4xl whitespace-pre-line font-semibold'>
                <span className='leading-snug'>
                  {user.first_name} {user.last_name}
                </span>
              </h1>
              <div className='flex items-center space-x-2'>
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <link.icon className='w-5 h-5 fill-primary rounded-sm hover:fill-foreground' />
                  </a>
                ))}
              </div>
            </div>
            <p>
              Inscrit depuis le <FormattedDate isoDate={user.created_at} />.
            </p>
            {user.id === currentUser.id && <p>Profil complété à 20 %.</p>}
            <p>0 points d'impact.</p>
          </div>
        </div>
        <div className='flex flex-col justify-center ml-auto gap-8'>
          {user.id === currentUser.id && (
            <div className='flex justify-end'>
              <Link
                href=''
                className={`${buttonVariants({
                  size: 'lg'
                })}`}
              >
                <Settings />
                Mes paramètres
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
