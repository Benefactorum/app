import type { ReactElement } from 'react'
import { Head } from '@inertiajs/react'
import type { FileAsObject, OsblUpdate } from '@/pages/Contribution/types'
import { Button, buttonVariants } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import Gestion from '@/components/pages/osbl/show/Gestion'

interface Props {
  osbl: OsblUpdate
}

export default function Show ({ osbl }: Props): ReactElement {
  return (
    <>
      <Head>
        <title>{osbl.name}</title>
        <meta name='description' content={osbl.description} />
      </Head>
      <div className='flex flex-col sm:flex-row py-8 2xl:container mx-auto px-2 sm:px-8 lg:px-16 gap-8 lg:gap-16'>
        <div className='flex flex-grow xl:flex-none lg:w-1/2 flex-col justify-center gap-8 lg:gap-16'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl whitespace-pre-line'>
            {osbl.name}
          </h1>
          {osbl.logo !== undefined && (
            <div className='flex sm:hidden justify-center items-center'>
              <div className='w-[200px]'>
                <AspectRatio ratio={1}>
                  <img
                    src={(osbl.logo as FileAsObject).url}
                    alt={`logo de ${osbl.name}`}
                    title={`logo de ${osbl.name}`}
                  />
                </AspectRatio>
              </div>
            </div>
          )}
          <h2 className=''>
            {osbl.description}
          </h2>
          <div className='flex flex-wrap gap-4'>
            <Button variant='secondary' mode='disabled'>
              Faire un don
            </Button>
            <a className={cn(buttonVariants({ variant: 'default' }), 'flex items-center gap-2')} href={osbl.website} target='_blank' rel='noreferrer'>
              <ExternalLink />
              Visiter {osbl.website?.replace('https://', '').replace('http://', '').replace('www.', '').replace('/', '')}
            </a>
          </div>
        </div>
        <div className='hidden sm:flex sm:w-1/2 md:w-1/3 lg:w-1/2 justify-center items-center'>
          {osbl.logo !== undefined && (
            <div className='w-[200px] md:w-[400px]'>
              <AspectRatio ratio={1}>
                <img
                  src={(osbl.logo as FileAsObject).url}
                  alt={`logo de ${osbl.name}`}
                  title={`logo de ${osbl.name}`}
                />
              </AspectRatio>
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
            <TabsList className='w-full justify-start'>
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
                  <p>Contenu de la fiche technique</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='fiche'>
              <Card>
                <CardContent className='pt-6'>
                  <p>Contenu de la fiche technique</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='implantation'>
              <Card>
                <CardContent className='pt-6'>
                  <p>Contenu de l'implantation</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='documents'>
              <Card>
                <CardContent className='pt-6'>
                  <p>Contenu des documents</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>

  )
}
