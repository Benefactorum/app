import { createInertiaApp } from '@inertiajs/react'
import { createElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { getTitle, resolvePage } from '@/lib/inertiaConfig'

void createInertiaApp({
  title: getTitle,
  // Disable progress bar
  //
  // see https://inertia-rails.netlify.app/guide/progress-indicators
  // progress: false,
  resolve: resolvePage,
  setup ({ el, App, props }) {
    if (el !== null && el !== undefined) {
      if (el.dataset.serverRendered === 'true') {
        hydrateRoot(el, createElement(App, props))
      } else {
        const root = createRoot(el)
        root.render(createElement(App, props))
      }
    } else {
      console.error(
        'Missing root element.\n\n' +
          'If you see this error, it probably means you load Inertia.js on non-Inertia pages.\n' +
          "Consider moving <%= vite_typescript_tag 'inertia' %> to the Inertia-specific layout instead."
      )
    }
  }
})
