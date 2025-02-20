import HelpTooltip from '@/components/shared/HelpTooltip'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import type { NewOsbl } from '@/pages/Contribution/types'
import PieChartComponent from '@/components/charts/PieChartComponent'
import MyCheckbox from '@/components/shared/MyCheckbox'
import { Separator } from '@/components/ui/separator'
import { formatAmount } from '@/lib/formatters'

interface Props {
  osbl: NewOsbl
}

function getTreasuryMargin (treasury: number | undefined, budget: number | undefined): string | React.ReactElement {
  if (treasury === undefined || budget === undefined) {
    return <span className='text-muted-foreground'>-</span>
  }

  const formatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  })
  return <span className='whitespace-nowrap'>{formatter.format(treasury / (budget / 12))} mois</span>
}

export default function Gestion ({ osbl }: Props): React.ReactElement {
  const sortedFinances = osbl.annual_finances_attributes?.sort((a, b) => a.year - b.year) ?? []
  const startIndex = sortedFinances.length - 1

  if (sortedFinances.length === 0) {
    return (
      <div className='w-full flex justify-center items-center py-12'>
        <p className='text-lg text-muted-foreground'>Informations manquantes.</p>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <Carousel
        opts={{
          loop: false,
          slidesToScroll: 'auto',
          // watchDrag: false,
          startIndex
        }}
      >
        <CarouselContent>
          {sortedFinances.map((finance, index) => (
            <CarouselItem key={index}>
              <div className='w-full mx-auto'>
                <h2 className='text-3xl font-semibold text-center'>
                  {finance.year}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16'>
                  <div>
                    <PieChartComponent
                      data={finance.fund_sources_attributes}
                      title="D'où proviennent 100€ de ressources ?"
                    />
                  </div>

                  <div>
                    <PieChartComponent
                      data={finance.fund_allocations_attributes}
                      title='À quoi ont servi 100€ de ressources ?'
                    />
                  </div>

                  <div className='lg:border-l-2 border-muted lg:pl-8 flex-grow flex items-center justify-center md:col-span-2 lg:col-span-1'>
                    <div className='grid gap-4 w-full max-w-md'>
                      <div className='flex justify-between gap-4'>
                        <p className='font-medium flex-shrink-0'>Budget annuel :</p>
                        <span className='text-right'>
                          {finance.budget !== undefined
                            ? formatAmount(finance.budget)
                            : <span className='text-muted-foreground'>-</span>}
                        </span>
                      </div>

                      <div className='flex items-center justify-between gap-4'>
                        <div className='flex flex-col'>
                          <p className='font-medium'>
                            <span className='whitespace-nowrap'>Marge de</span>{' '}
                            <span className='whitespace-nowrap'>
                              trésorerie
                              <HelpTooltip className='mb-1 mx-2'>
                                <p>La marge de trésorerie indique combien de temps une association peut fonctionner sans nouveaux apports de fonds.</p>
                                <p>C'est un indicateur clé de la solidité financière de l'association.</p>
                                <p>Une bonne marge se situe généralement <span className='font-semibold'>entre 3 et 6 mois</span>, permettant de faire face aux imprévus.</p>
                              </HelpTooltip>
                              :
                            </span>
                          </p>
                        </div>
                        <span className='text-right'>
                          {getTreasuryMargin(finance.treasury, finance.budget)}
                        </span>
                      </div>

                      <div className='flex items-center justify-between gap-4'>
                        <p className='font-medium flex-shrink-0'>
                          Comptes certifiés
                          <HelpTooltip className='mb-1 mx-2'>
                            <p>Pour une association, des comptes certifiés signifient que ses finances ont été <span className='font-semibold'>vérifiées par un expert indépendant</span>, comme un commissaire aux comptes.</p>
                            <p>Cette vérification atteste que les fonds sont gérés de manière responsable et que les comptes reflètent fidèlement la situation financière de l'association.</p>
                          </HelpTooltip>
                          :
                        </p>
                        <MyCheckbox
                          id='certified'
                          checked={finance.certified ?? false}
                          disabled
                          className='data-[disabled]:opacity-100'
                        />
                      </div>

                      <div className='flex items-center justify-between gap-4'>
                        <p className='font-medium'>
                          <span className='whitespace-nowrap'>Reconnue</span>{' '}
                          <span className='whitespace-nowrap'>
                            d'utilité publique
                            <HelpTooltip className='mb-1 mx-2'>
                              <p>Les organismes reconnus d'utilité publique (ARUP & FRUP) sont <span className='font-semibold'>sous le contrôle direct de l'État</span>, garantissant une gestion transparente et une utilisation appropriée des fonds.</p>
                            </HelpTooltip>
                            :
                          </span>
                        </p>
                        <MyCheckbox
                          id='public_utility'
                          checked={osbl.public_utility ?? false}
                          disabled
                          className='data-[disabled]:opacity-100'
                        />
                      </div>

                      <Separator />

                      <div className='flex justify-between gap-4'>
                        <p className='font-medium flex-shrink-0'>
                          Label(s)
                          <HelpTooltip className='mb-1 mx-2'>
                            <p>Les processus d'obtention et de renouvellement des labels impliquent des <span className='font-semibold'>audits rigoureux</span> et un examen approfondi des pratiques internes de l'association.</p>
                            <p>Ils sont gages de transparence et de bonne gestion.</p>
                          </HelpTooltip>
                          :
                        </p>
                        {osbl.osbls_labels_attributes === undefined
                          ? <span className='text-muted-foreground'>-</span>
                          : (
                            <div className='flex flex-col items-end gap-2'>
                              {osbl.osbls_labels_attributes?.map((label) => (
                                <div className='lg:w-28' key={label.label_id}>
                                  <img
                                    src={label.logo_url}
                                    alt={label.name}
                                    title={label.name}
                                  />
                                </div>
                              ))}
                            </div>
                            )}
                      </div>

                      <Separator />

                      <div className='flex items-center justify-between gap-4'>
                        <p className='font-medium'>Nombre d'employés : </p>
                        <span className='text-right'>{finance.employees_count ?? <span className='text-muted-foreground'>-</span>}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          size='lg'
          variant='secondary'
          className='top-4 -mr-2 left-auto right-1/2 -translate-x-[86px] lg:hidden'
        />
        <CarouselNext
          size='lg'
          variant='secondary'
          className='top-4 -ml-2 left-1/2 translate-x-[86px] lg:hidden'
        />
        <CarouselPrevious
          variant='secondary'
          className='-ml-6 hidden lg:flex'
        />
        <CarouselNext
          variant='secondary'
          className='-mr-6 hidden lg:flex'
        />
      </Carousel>
    </div>
  )
}
