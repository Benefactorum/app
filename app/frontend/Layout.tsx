import { ReactElement, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import AppSidebar from '@/components/layout/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const flashTypes = ['message', 'success', 'info', 'warning', 'error'] as const

interface LayoutProps {
  showSidebar: boolean
  flash: { [key in typeof flashTypes[number]]?: string }
  children?: ReactElement
}

export default function Layout ({
  children,
  showSidebar,
  flash = {}
}: LayoutProps): ReactElement {
  useEffect(() => {
    flashTypes.forEach((type) => {
      if (flash[type] !== undefined && flash[type] !== '') {
        toast[type](flash[type])
      }
    })
  }, [flash])

  return (
    <div className='flex flex-col min-h-screen overflow-x-hidden'>
      <Header />
      <Toaster theme='light' position='top-right' richColors closeButton />
      {showSidebar
        ? (
          <SidebarProvider>
            <AppSidebar />
            <main className='flex flex-col flex-grow overflow-x-hidden'>
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
          )
        : (
          <main className='flex flex-col flex-grow overflow-x-hidden'>{children}</main>
          )}
      <Footer />
    </div>
  )
}
