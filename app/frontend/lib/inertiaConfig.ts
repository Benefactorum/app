import { createElement, ReactElement } from 'react'
import type { PageResolver } from '@inertiajs/core'
import Layout from '@/Layout'

interface ResolvedComponent {
  default: {
    layout: (pageContent: ReactElement & { props: { flash?: any } }) => ReactElement
  }
}

export const getTitle = (title: string | null): string =>
  title !== null ? `${title} | Benefactorum` : 'Benefactorum'

export const resolvePage: PageResolver = (name) => {
  const pages = import.meta.glob<ResolvedComponent>(
    '../pages/**/!(*.test).tsx',
    { eager: true }
  )
  const page = pages[`../pages/${name}.tsx`]

  if (page === undefined) {
    throw new Error(`Page ${name}.tsx not found`)
  }

  page.default.layout = (pageContent) =>
    createElement(Layout, {
      showSidebar: name.startsWith('Contribution/'),
      flash: pageContent.props?.flash
    }, pageContent)
  return page
}
