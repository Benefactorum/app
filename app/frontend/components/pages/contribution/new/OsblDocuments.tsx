import { ReactElement } from 'react'
import { FormProps, Document } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import { PlusIcon, TrashIcon, PencilIcon } from 'lucide-react'
import {
  Sheet,
  SheetTrigger
} from '@/components/ui/sheet'
import OsblDocumentSheet from './OsblDocuments/OsblDocumentSheet'

export default function OsblDocuments ({ data, setData, errors, clearErrors, setError }: FormProps): ReactElement {
  const documents = data.document_attachments_attributes ?? []

  function addDocument (document: Document, index: number): void {
    const updatedDocuments = [...documents]
    updatedDocuments[index] = { document_attributes: document }

    setData('document_attachments_attributes', updatedDocuments)
  }

  function handleDocumentRemove (e: React.MouseEvent<HTMLButtonElement>, index: number): void {
    e.preventDefault() // prevent the form from being submitted
    setData('document_attachments_attributes', documents.filter((_, i) => i !== index))
  }

  function getDocumentDisplayName (document: Document): string {
    if (document.name !== undefined) {
      return document.name
    }

    if (["Rapport d'activité", 'Rapport financier'].includes(document.type)) {
      return `${document.type} ${document.year as number}`
    }

    return document.type
  }

  return (
    <div className='bg-white rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col w-full h-full'>
      <div className='flex flex-wrap gap-4 items-center justify-between'>
        <h2 className='text-2xl font-semibold w-[145px]'>Documents</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline'>
              <PlusIcon className='w-4 h-4' />
              <span className='ml-2 hidden sm:block lg:hidden xl:block'>Ajouter</span>
            </Button>
          </SheetTrigger>
          <OsblDocumentSheet
            key={`document-${documents.length}`}
            document={{}}
            index={documents.length}
            onUpdate={(doc) => addDocument(doc, documents.length)}
            errors={errors}
            clearErrors={clearErrors}
            setError={setError}
          />
        </Sheet>
      </div>

      {documents.length > 0 && (
        <div className='flex flex-col gap-4'>
          {documents.map((doc, index) => (
            <Sheet key={`document-${index}`}>
              <div className='flex items-center justify-between p-4 border rounded-lg bg-white'>
                <p>{getDocumentDisplayName(doc.document_attributes)}</p>
                <div className='flex gap-2 '>
                  <SheetTrigger asChild>
                    <Button variant='outline' className='bg-white text-primary border-none'>
                      <PencilIcon />
                    </Button>
                  </SheetTrigger>
                  <Button
                    onClick={(e) => handleDocumentRemove(e, index)}
                    variant='outline'
                    className='bg-white text-red-500 border-none'
                  >
                    <TrashIcon className='w-4 h-4' />
                  </Button>
                </div>
              </div>

              <OsblDocumentSheet
                document={doc.document_attributes}
                index={index}
                onUpdate={(doc) => addDocument(doc, index)}
                errors={errors}
                clearErrors={clearErrors}
                setError={setError}
              />
            </Sheet>
          ))}
        </div>
      )}
    </div>
  )
}
