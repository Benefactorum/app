import { createElement } from "react";
import type { ResolvedComponent } from "@inertiajs/react";
import Layout from "@/Layout";

export const getTitle = (title: string | null): string =>
  title ? `${title} | Benefactorum` : "Benefactorum";

export const resolvePage = (name: string): ResolvedComponent => {
  const pages = import.meta.glob<ResolvedComponent>("../pages/**/!(*.test).tsx", { eager: true });
  const page = pages[`../pages/${name}.tsx`] as {
    default: { layout?: (page: JSX.Element) => JSX.Element };
  };
  if (!page) {
    console.error(`Missing Inertia page component: '${name}.tsx'`);
  }
  page.default.layout = (page) =>
    createElement(Layout, { showSidebar: name.startsWith("Contribution/"), flash: page.props.flash }, page);
  return page;
};
