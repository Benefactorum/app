import { createInertiaApp, type ResolvedComponent } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
import { createElement } from "react"; // Add this import
import Layout from "@/Layout";
import LayoutForContribution from "@/LayoutForContribution";

createServer((page) =>
  createInertiaApp({
    page,
    title: (title) => (title ? `${title} | Benefactorum` : "Benefactorum"),
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<ResolvedComponent>("../pages/**/*.tsx", { eager: true });
      const page = pages[`../pages/${name}.tsx`];
      if (!page) {
        console.error(`Missing Inertia page component: '${name}.svelte'`)
      }
      page.default.layout = name.startsWith('Contribution/')
      ? (page) => createElement(LayoutForContribution, null, page)
      : (page) => createElement(Layout, null, page);
      return page;
    },
    setup: ({ App, props }) => createElement(App, props),
  })
);
