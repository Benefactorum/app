import { FilePlus2, Library, NotebookPen } from 'lucide-react'
import { usePage } from '@inertiajs/react'
import { ReactElement } from 'react'
import MyLink from '@/components/shared/MyLink'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'

const items = [
  {
    title: 'Mon historique',
    url: '/mes-contributions',
    icon: Library
  },
  {
    title: 'Nous écrire',
    url: '#',
    icon: NotebookPen
  },
  {
    title: 'Ajouter une association',
    url: '/mes-contributions/ajouter-une-association',
    icon: FilePlus2
  }
]

export default function AppSidebar (): ReactElement {
  const { url } = usePage()
  const { setOpenMobile, isMobile } = useSidebar()

  const handleClick = (): void => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <MyLink
                      href={item.url}
                      className={
                        url === item.url
                          ? ' bg-secondary'
                          : ' hover:bg-secondary/50'
                      }
                      onClick={handleClick}
                    >
                      <item.icon />
                      <span className='font-semibold'>{item.title}</span>
                    </MyLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
