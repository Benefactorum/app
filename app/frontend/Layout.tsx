import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  flash?: { notice: string };
};

export default function Layout({ children, flash }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {flash?.notice && (
          <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
            {flash.notice}
          </p>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
