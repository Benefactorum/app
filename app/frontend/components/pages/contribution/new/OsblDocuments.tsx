import { ReactElement } from 'react'
import { FormProps, Document } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import {
  Sheet,
  SheetTrigger
} from '@/components/ui/sheet'
import OsblDocumentSheet from '@/components/pages/contribution/new/OsblDocuments/OsblDocumentSheet'
import SheetTriggerItem from '@/components/pages/contribution/new/shared/SheetTriggerItem'

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
              <PlusIcon />
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
              <SheetTriggerItem
                displayName={getDocumentDisplayName(doc.document_attributes)}
                onRemove={(e) => handleDocumentRemove(e, index)}
              />

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
