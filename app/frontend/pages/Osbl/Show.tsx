import type { ReactElement } from 'react'
import { Head } from '@inertiajs/react'
import type { FileAsObject, OsblUpdate, NewOsbl } from '@/pages/Contribution/types'
import { getOsblData } from '@/lib/osblData'
import { Button, buttonVariants } from '@/components/ui/button'
import { ExternalLink, Ban } from 'lucide-react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import GestionTab from '@/components/pages/osbl/show/GestionTab'
import DataSheetTab from '@/components/pages/osbl/show/DataSheetTab'
import { cn } from '@/lib/utils'

interface Props {
  osbl: OsblUpdate
}

function renderMissingInformation (): ReactElement {
  return (
    <div className='w-full flex justify-center items-center py-12'>
      <p className='text-lg text-muted-foreground'>Informations manquantes.</p>
    </div>
  )
}

export default function Show ({ osbl }: Props): ReactElement {
  const processedOsbl: NewOsbl = getOsblData(osbl)

  return (
    <>
      <Head>
        <title>{processedOsbl.name}</title>
        <meta name='description' content={processedOsbl.description} />
      </Head>
      <div className='flex flex-col sm:flex-row py-8 w-full 2xl:container mx-auto px-2 sm:px-8 lg:px-16 gap-8 lg:gap-16'>
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
                <a className={cn(buttonVariants({ variant: 'default' }), 'flex items-center gap-2')} href={processedOsbl.website} target='_blank' rel='noreferrer'>
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
      <div className='w-full bg-white'>
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
                <CardContent className='pt-6'>
                  <DataSheetTab osbl={processedOsbl} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='implantation'>
              <Card>
                <CardContent className='pt-6'>

                  {renderMissingInformation()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='documents'>
              <Card>
                <CardContent className='pt-6'>
                  {renderMissingInformation()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
