import { ReactElement, useState } from 'react'
import { FormProps, Document } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import { PlusIcon, TrashIcon, PencilIcon } from 'lucide-react'
import {
  Sheet,
  SheetTrigger
} from '@/components/ui/sheet'
import OsblDocumentSheet from './OsblDocumentSheet'
import { DocumentTypeList } from '@/lib/constants'

export default function OsblDocuments ({ data, setData, errors, clearErrors, setError }: FormProps): ReactElement {
  const [sheetKey, setSheetKey] = useState(0)
  const documents = data.document_attachments_attributes ?? []

  function addDocument (document: Document, index: number): void {
    const updatedDocuments = [...documents]
    updatedDocuments[index] = { document_attributes: document }

    setSheetKey((prev) => prev + 1)
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

    if (['rapport_activite', 'rapport_financier'].includes(document.type)) {
      const documentType = DocumentTypeList.find(type => type.value === document.type) as { label: string }
      return `${documentType.label} ${document.year as number}`
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
            key={sheetKey}
            document={{}}
            index={documents.length}
            onUpdate={(doc) => addDocument(doc, documents.length)}
            errors={errors}
            clearErrors={clearErrors}
            setError={setError as (field: string, error: string) => void}
          />
        </Sheet>
      </div>

      {documents.length > 0 && (
        <div className='flex flex-col gap-4'>
          {documents
            .map((doc, index) => {
              const hasError = errors[`document_attachments_attributes.${index}.document_attributes.file`]
              return (
                <Sheet key={`document-${index}`}>
                  <div className={`flex items-center justify-between p-4 border rounded-lg bg-white ${hasError !== undefined ? 'border-red-600' : ''}`}>
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
                    document={doc.document_attributes ?? {}}
                    index={index}
                    onUpdate={(doc) => addDocument(doc, index)}
                    errors={errors}
                    clearErrors={clearErrors}
                    setError={setError as (field: string, error: string) => void}
                  />
                </Sheet>
              )
            })}
        </div>
      )}
    </div>
  )
}
