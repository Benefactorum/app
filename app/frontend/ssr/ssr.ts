import { createInertiaApp, type ResolvedComponent } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
import { createElement } from "react";
import Layout from "@/Layout";

createServer((page) =>
  createInertiaApp({
    page,
    title: (title) => (title ? `${title} | Benefactorum` : "Benefactorum"),
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<ResolvedComponent>("../pages/**/*.tsx", { eager: true });
      const page = pages[`../pages/${name}.tsx`];
      if (!page) {
        console.error(`Missing Inertia page component: '${name}.tsx'`);
      }
      page.default.layout = (page) =>
        createElement(Layout, { showSidebar: name.startsWith("Contribution/"), flash: page.props.flash}, page);
      return page;
    },
    setup: ({ App, props }) => createElement(App, props),
  })
);
