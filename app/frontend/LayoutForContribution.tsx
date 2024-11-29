import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ReactElement, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

type LayoutProps = {
  children: ReactElement;
};

const flash_types: Array<keyof typeof toast> = [
  "message",
  "success",
  "info",
  "warning",
  "error",
];

export default function Layout({ children }: LayoutProps) {
  const { flash = {} } = usePage<{
    flash?: { [key: string]: string };
  }>().props;

  useEffect(() => {
    flash_types.forEach((type) => {
      if (flash?.[type]) {
        toast[type](flash[type] as any);
      }
      if (flash?.alert) {
        toast.error(flash.alert);
      }
    });
  }, [flash]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Toaster theme="light" position="top-right" richColors closeButton />
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col flex-grow">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
      <Footer />
    </div>
  );
}
