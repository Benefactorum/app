import Header from "./components/Header";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  flash?: { notice: string };
};

export default function Layout({ children, flash }: LayoutProps) {
  return (
    <>
      <Header />
      <main>
        {flash?.notice && (
          <p className="py-2 px-3 bg-green-50 mb-5 text-green-500 font-medium rounded-lg inline-block">
            {flash.notice}
          </p>
        )}
        {children}
      </main>
    </>
  );
}
