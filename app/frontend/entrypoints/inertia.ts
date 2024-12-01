import { createInertiaApp, type ResolvedComponent } from "@inertiajs/react";
import { createElement } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import Layout from "@/Layout";
import LayoutForContribution from "@/LayoutForContribution";

createInertiaApp({
  title: (title) => (title ? `${title} | Benefactorum` : "Benefactorum"),

  // Disable progress bar
  //
  // see https://inertia-rails.netlify.app/guide/progress-indicators
  // progress: false,

  resolve: (name) => {
    const pages = import.meta.glob<ResolvedComponent>("../pages/**/*.tsx", { eager: true });
    const page = pages[`../pages/${name}.tsx`] as {
      default: { layout?: (page: JSX.Element) => JSX.Element };
    };
    if (!page) {
      console.error(`Missing Inertia page component: '${name}.tsx'`)
    }
    page.default.layout = name.startsWith('Contribution/')
      ? (page) => createElement(LayoutForContribution, null, page)
      : (page) => createElement(Layout, null, page);
    return page;
  },

  setup({ el, App, props }) {
    if (el) {
      if (el.dataset.serverRendered === 'true') {
        hydrateRoot(el, createElement(App, props));
      } else {
        // createRoot(el).render(<App {...props} />);
        const root = createRoot(el);
        root.render(createElement(App, props));
      }
    } else {
      console.error(
        'Missing root element.\n\n' +
        'If you see this error, it probably means you load Inertia.js on non-Inertia pages.\n' +
        'Consider moving <%= vite_typescript_tag "inertia" %> to the Inertia-specific layout instead.',
      )
    }

  },
});
