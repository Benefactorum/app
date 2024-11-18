import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ReactElement, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

type LayoutProps = {
  children: ReactElement;
};

export default function Layout({ children }: LayoutProps) {
  const { flash = {} } = usePage<{
    flash?: { alert?: string; notice?: string };
  }>().props;

  useEffect(() => {
    if (flash?.notice) {
      toast.success(flash.notice);
    }
    if (flash?.alert) {
      toast.error(flash.alert);
    }
  }, [flash?.notice, flash?.alert]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Toaster theme="light" position="top-right" richColors closeButton />
      <main className="flex flex-col flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
