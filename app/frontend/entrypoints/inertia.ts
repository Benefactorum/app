import { createInertiaApp } from "@inertiajs/react";
import { createElement } from "react";
// import { createRoot } from "react-dom/client";
import { hydrateRoot } from "react-dom/client";
import Layout from "../Layout";

createInertiaApp({
  title: (title) => (title ? `${title} | Benefactorum` : "Benefactorum"),

  // Disable progress bar
  //
  // see https://inertia-rails.netlify.app/guide/progress-indicators
  // progress: false,

  resolve: (name) => {
    const pages = import.meta.glob("../pages/**/*.tsx", { eager: true });
    const page = pages[`../pages/${name}.tsx`] as {
      default: { layout?: (page: JSX.Element) => JSX.Element };
    };
    page.default.layout ||= (page) => createElement(Layout, null, page);
    return page;
  },

  setup({ el, App, props }) {
    // const root = createRoot(el);

    // root.render(createElement(App, props));

    // createRoot(el).render(<App {...props} />);
    hydrateRoot(el, createElement(App, props));
  },
});
