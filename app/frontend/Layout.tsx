import { Head } from "@inertiajs/react";
import Logo from "/assets/logo.svg";

import Header from "./components/Header";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  flash?: { notice: string };
};

export default function Layout({ children, flash }: LayoutProps) {
  return (
    <>
      <Head>
        <meta
          head-key="description"
          name="description"
          content="Benefactorum, association de bienfaiteurs est un site agrégeant toutes les associations d'intérêt général françaises."
        />
      </Head>
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
