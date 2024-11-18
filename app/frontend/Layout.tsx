import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ReactElement } from "react";
import { usePage } from "@inertiajs/react";

type LayoutProps = {
  children: ReactElement;
};

export default function Layout({ children }: LayoutProps) {
  const { flash = {} } = usePage<{
    flash?: { alert?: string; notice?: string };
  }>().props;
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col flex-grow">
        {flash?.notice && (
          <p className="py-2 px-4 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
            {flash.notice}
          </p>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
