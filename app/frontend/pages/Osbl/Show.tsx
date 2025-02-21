import type { ReactElement } from 'react'
import { Head, Link } from '@inertiajs/react'
import type { FileAsObject, OsblUpdate, NewOsbl } from '@/pages/Contribution/types'
import { getOsblData } from '@/lib/osblData'
import { Button, buttonVariants } from '@/components/ui/button'
import { ExternalLink, Ban, Pencil, UserCheck } from 'lucide-react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import GestionTab from '@/components/pages/osbl/show/GestionTab'
import DataSheetTab from '@/components/pages/osbl/show/DataSheetTab'
import LocationsTab from '@/components/pages/osbl/show/LocationsTab'
import DocumentsTab from '@/components/pages/osbl/show/DocumentsTab'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface Props {
  contribution?: { id: number, status: string }
  osbl: OsblUpdate
}

function getStatusLabel (status: string): string {
  switch (status) {
    case 'brouillon':
      return ' cette contribution n\'est pas encore finalisée.'
    case 'en attente de revue':
      return ' cette contribution est en attente d\'être validée par un modérateur.'
    case 'demande de modification':
      return ' cette contribution nécessite des modifications.'
    case 'validée':
      return ' cette contribution a été validée.'
    case 'rejetée':
      return ' cette contribution a été rejetée.'
    default:
      return ' cette contribution n\'est pas dans un état valide.'
  }
}

export default function Show ({ osbl, contribution }: Props): ReactElement {
  const processedOsbl: NewOsbl = getOsblData(osbl)
  const bannerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bannerRef.current instanceof HTMLElement) {
      document.documentElement.style.setProperty('--contribution-banner-height', `${bannerRef.current.offsetHeight}px`)
    } else {
      document.documentElement.style.setProperty('--contribution-banner-height', '0px')
    }

    if (headerRef.current instanceof HTMLElement) {
      document.documentElement.style.setProperty('--header-height', `${headerRef.current.offsetHeight}px`)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{processedOsbl.name}</title>
        <meta name='description' content={processedOsbl.description} />
      </Head>
      {contribution !== undefined && (
        <div ref={bannerRef} className='w-full bg-foreground py-4'>
          <div className='2xl:container mx-auto px-2 sm:px-8 lg:px-16 flex items-center gap-4 flex-wrap'>
            <p className='text-background'>
              <span className='font-semibold'>{contribution.status.toUpperCase()} :</span>
              {getStatusLabel(contribution.status)}
            </p>
            <div className='flex gap-2 flex-wrap'>
              <Link href={`/mes-contributions/${contribution.id}/modifier`} title='Modifier'>
                <Button variant='outline'>
                  <Pencil />
                  Modifier
                </Button>
              </Link>
              <Link href={`/mes-contributions/${contribution.id}/soumettre`} title='Soumettre pour revue'>
                <Button>
                  <UserCheck />
                  Soumettre pour revue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <div ref={headerRef} className='flex flex-col sm:flex-row py-8 w-full 2xl:container mx-auto px-2 sm:px-8 lg:px-16 gap-8 lg:gap-16'>
        <div className='flex flex-grow flex-col justify-center gap-8 lg:gap-16'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl whitespace-pre-line'>
            {processedOsbl.name}
          </h1>
          {processedOsbl.logo !== undefined
            ? (
              <div className='flex sm:hidden justify-center items-center'>
                <div className='w-[200px]'>
                  <AspectRatio ratio={1}>
                    <img
                      src={(processedOsbl.logo as FileAsObject).url}
                      alt={`logo de ${processedOsbl.name}`}
                      title={`logo de ${processedOsbl.name}`}
                      className='object-contain w-full h-full'
                    />
                  </AspectRatio>
                </div>
              </div>
              )
            : (
              <div className='flex sm:hidden justify-center items-center text-gray-500 italic'>
                (logo absent)
              </div>
              )}
          <h2>
            {processedOsbl.description ?? <span className='text-muted-foreground'>Aucune description fournie.</span>}
          </h2>
          <div className='flex flex-wrap gap-4'>
            <Button variant='secondary' mode='disabled'>
              Faire un don
            </Button>
            {processedOsbl.website !== undefined
              ? (
                <a className={cn(buttonVariants({ variant: 'default' }), 'flex items-center gap-2')} href={processedOsbl.website} target='_blank' rel='noopener noreferrer'>
                  <ExternalLink />
                  Visiter {processedOsbl.website?.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/$/, '')}
                </a>
                )
              : (
                <Button variant='ghost' mode='disabled' className='flex items-center gap-2'>
                  <Ban className='text-destructive' />
                  Pas de page internet
                </Button>
                )}
          </div>
        </div>
        <div className='hidden sm:flex sm:w-1/2 md:w-1/3 lg:w-1/2 justify-center items-center'>
          {processedOsbl.logo !== undefined
            ? (
              <div className='w-[200px] md:w-[400px]'>
                <AspectRatio ratio={1}>
                  <img
                    src={(processedOsbl.logo as FileAsObject).url}
                    alt={`logo de ${processedOsbl.name}`}
                    title={`logo de ${processedOsbl.name}`}
                    className='object-contain w-full h-full'
                  />
                </AspectRatio>
              </div>
              )
            : (
              <div className='text-gray-500 italic'>
                (logo absent)
              </div>
              )}
        </div>
      </div>
      <div className='w-full bg-white min-h-[calc(100vh-var(--header-height,0px)-var(--contribution-banner-height,0px))]'>
        <div className='flex flex-col py-16 2xl:container mx-auto px-2 sm:px-8 lg:px-16 gap-8 bg-white w-full'>
          <p className='text-center italic'>
            Benefactorum est un site participatif, dont le contenu est alimenté et modéré par des utilisateurs bénévoles.
          </p>

          <Tabs defaultValue='gestion' className='w-full'>
            <TabsList className='w-full justify-start flex-wrap mb-2 h-auto'>
              <TabsTrigger value='gestion' className='flex-1'>
                Gestion
              </TabsTrigger>
              <TabsTrigger value='fiche' className='flex-1'>
                Fiche technique
              </TabsTrigger>
              <TabsTrigger value='implantation' className='flex-1'>
                Implantation
              </TabsTrigger>
              <TabsTrigger value='documents' className='flex-1'>
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value='gestion'>
              <Card>
                <CardContent className='pt-6'>
                  <GestionTab osbl={processedOsbl} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='fiche'>
              <Card>
                <CardContent className='p-2 sm:p-6 pt-6'>
                  <DataSheetTab osbl={processedOsbl} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='implantation'>
              <Card>
                <CardContent className='p-0 sm:p-6 pt-6'>
                  <LocationsTab osbl={processedOsbl} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='documents'>
              <Card>
                <CardContent className='p-0 sm:p-6 pt-6'>
                  <DocumentsTab osbl={processedOsbl} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
