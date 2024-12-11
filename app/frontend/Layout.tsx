import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ReactElement, useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'

interface LayoutProps {
  children: ReactElement
  showSidebar?: boolean
  flash?: { [key: string]: string }
}

const flashTypes: Array<keyof typeof toast> = [
  'message',
  'success',
  'info',
  'warning',
  'error'
]

export default function Layout ({
  children,
  showSidebar = false,
  flash = {}
}: LayoutProps): ReactElement {
  useEffect(() => {
    flashTypes.forEach((type) => {
      if (flash[type] !== undefined && flash[type] !== '') {
        toast[type](flash[type] as any)
      }
    })
  }, [flash])

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <Toaster theme='light' position='top-right' richColors closeButton />
      {showSidebar
        ? (
          <SidebarProvider>
            <AppSidebar />
            <main className='flex flex-col flex-grow'>
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
          )
        : (
          <main className='flex flex-col flex-grow'>{children}</main>
          )}
      <Footer />
    </div>
  )
}
