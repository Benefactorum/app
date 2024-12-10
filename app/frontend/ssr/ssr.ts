import { createInertiaApp } from "@inertiajs/react"
import createServer from "@inertiajs/react/server"
import ReactDOMServer from "react-dom/server"
import { createElement } from "react"
import { getTitle, resolvePage } from "@/entrypoints/inertiaConfig"

createServer((page) =>
  createInertiaApp({
    page,
    title: getTitle,
    render: ReactDOMServer.renderToString,
    resolve: resolvePage,
    setup: ({ App, props }) => createElement(App, props),
  })
)
