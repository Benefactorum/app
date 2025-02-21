import { NewOsbl } from '@/pages/Contribution/types'
import DocumentCard from './DocumentsTab/DocumentCard'
import { DOCUMENT_TYPES } from '@/lib/constants'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { useEffect, useState } from 'react'

interface Props {
  osbl: NewOsbl
}

export default function DocumentsTab ({ osbl }: Props): React.ReactElement {
  const documents = (osbl.document_attachments_attributes !== undefined) ? osbl.document_attachments_attributes : []
  const [slidesToShow, setSlidesToShow] = useState(1)
  const [showControls, setShowControls] = useState(false)

  // Filter types to only those that have documents
  const typesWithDocuments = DOCUMENT_TYPES.filter(type =>
    Object.values(documents).some(doc => doc.document_attributes.type === type)
  )

  useEffect(() => {
    const updateSlidesToShow = (): void => {
      let slides = 1
      if (window.matchMedia('(min-width: 1536px)').matches) {
        slides = Math.min(5, typesWithDocuments.length) // xl
      } else if (window.matchMedia('(min-width: 1280px)').matches) {
        slides = Math.min(4, typesWithDocuments.length) // lg
      } else if (window.matchMedia('(min-width: 1024px)').matches) {
        slides = Math.min(3, typesWithDocuments.length) // md
      } else if (window.matchMedia('(min-width: 640px)').matches) {
        slides = Math.min(2, typesWithDocuments.length) // sm
      }
      setSlidesToShow(slides)
      setShowControls(slides < typesWithDocuments.length)
    }

    updateSlidesToShow()
    window.addEventListener('resize', updateSlidesToShow)
    return () => window.removeEventListener('resize', updateSlidesToShow)
  }, [typesWithDocuments.length])

  if (typesWithDocuments.length === 0) {
    return (
      <div className='p-6 text-center text-muted-foreground'>
        Aucun document disponible
      </div>
    )
  }

  return (
    <div className='p-2 pt-6'>
      <Carousel
        opts={{
          loop: true,
          slidesToScroll: 1,
          align: 'start'
        }}
        className='w-full'
      >
        <CarouselContent>
          {typesWithDocuments.map((type) => (
            <CarouselItem
              key={type}
              className={`flex flex-col items-center ${
                slidesToShow === 5
                  ? 'basis-1/5'
                  : slidesToShow === 4
                  ? 'basis-1/4'
                  : slidesToShow === 3
                  ? 'basis-1/3'
                  : slidesToShow === 2
                  ? 'basis-1/2'
                  : 'basis-full'
              }`}
            >
              <div className='w-full max-w-[400px]'>
                <h3 className='font-semibold text-lg text-center mb-4'>{type}</h3>
                <div className='max-h-[412px] overflow-y-auto pr-4'>
                  {Object.values(documents)
                    .filter(doc => doc.document_attributes.type === type)
                    .reverse()
                    .map((document, index) => (
                      <DocumentCard
                        key={`${type}-${index}`}
                        document={document}
                      />
                    ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {showControls && (
          <>
            <CarouselPrevious
              variant='secondary'
              className='top-4 mr-2 left-auto right-1/2 -translate-x-[86px] sm:hidden'
            />
            <CarouselNext
              variant='secondary'
              className='top-4 ml-2 left-1/2 translate-x-[86px] sm:hidden'
            />
            <CarouselPrevious
              variant='secondary'
              className='-ml-6 hidden sm:flex'
            />
            <CarouselNext
              variant='secondary'
              className='-mr-6 hidden sm:flex'
            />
          </>
        )}
      </Carousel>
    </div>
  )
}
