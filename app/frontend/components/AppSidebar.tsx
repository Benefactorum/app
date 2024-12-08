import { FilePlus2, Library, NotebookPen } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Mon historique",
    url: "/mes-contributions",
    icon: Library,
  },
  {
    title: "Nous écrire",
    url: "#",
    icon: NotebookPen,
  },
  {
    title: "Ajouter une association",
    url: "/mes-contributions/ajouter-une-association",
    icon: FilePlus2,
  },
]

export function AppSidebar() {
  const { url } = usePage();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className={url === item.url
                      ? " bg-secondary"
                      : " hover:bg-secondary/50"}>
                      <item.icon />
                      <span className="font-semibold">{item.title}</span>
                    </Link>
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
