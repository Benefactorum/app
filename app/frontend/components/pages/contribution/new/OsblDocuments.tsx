import { ReactElement } from 'react'
import { FormProps, Document } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import { PlusIcon, TrashIcon, PencilIcon } from 'lucide-react'
import {
  Sheet,
  SheetTrigger
} from '@/components/ui/sheet'
import OsblDocumentSheet from './OsblDocumentSheet'

const DocumentTypeList = [
  { value: 'statuts', label: 'Statuts' },
  { value: 'rapport_activite', label: "Rapport d'activité" },
  { value: 'rapport_financier', label: 'Rapport financier' },
  { value: 'proces_verbal', label: 'Procès verbal' },
  { value: 'autre', label: 'Autre' }
]

export default function OsblDocuments ({ data, setData, errors, clearErrors, setError }: FormProps): ReactElement {
  const documents = data.document_attachments_attributes ?? []
  const newDocumentIndex = documents.length - 1

  function updateDocumentAttribute (
    index: number,
    field: keyof Document,
    value: Document[typeof field]
  ): void {
    const updatedDocuments = documents.map((doc, i) =>
      i === index
        ? {
            ...doc,
            document_attributes: {
              ...(doc.document_attributes ?? {}),
              [field]: value
            }
          }
        : doc
    )

    setData('document_attachments_attributes', updatedDocuments)

    clearErrors(`document_attachments_attributes.${index}.document_attributes.${field}`)
    // if (field === 'file') {
    //   clearErrors(`document_attachments_attributes.${index}.document_attributes.file`)
    // }

    // if (field === 'type') {
    //   clearErrors(`document_attachments_attributes.${index}.document_attributes.type`)
    // }
  }

  function handleDocumentAdd (): void {
    const lastDocument = documents[newDocumentIndex]
    const isLastDocumentEmpty = lastDocument !== undefined &&
      (!lastDocument.document_attributes || Object.keys(lastDocument.document_attributes).length === 0)

    if (!isLastDocumentEmpty) {
      setData('document_attachments_attributes', [...documents, { document_attributes: {} }])
    }
  }

  function handleDocumentRemove (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ): void {
    e.preventDefault()
    const updatedDocuments = documents.filter((_, i) => i !== index)
    setData('document_attachments_attributes', updatedDocuments)
  }

  function getDocumentDisplayName (document: Document): string {
    if (['rapport_activite', 'rapport_financier'].includes(document?.type ?? '')) {
      return `${DocumentTypeList.find(type => type.value === document?.type)?.label ?? ''} ${document?.year ?? ''}`
    }

    if (document?.name !== undefined && document?.name !== '') {
      return document?.name
    }

    return document?.type ?? ''
  }

  return (
    <div className='bg-white rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col w-full h-full'>
      <div className='flex flex-wrap gap-4 items-center justify-between'>
        <h2 className='text-2xl font-semibold w-[145px]'>Documents</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button onClick={handleDocumentAdd} variant='outline'>
              <PlusIcon className='w-4 h-4' />
              <span className='ml-2 hidden sm:block lg:hidden xl:block'>Ajouter</span>
            </Button>
          </SheetTrigger>
          <OsblDocumentSheet
            document={documents[newDocumentIndex]?.document_attributes ?? {}}
            index={newDocumentIndex}
            errors={errors}
            onUpdate={(attribute, value) => updateDocumentAttribute(newDocumentIndex, attribute, value)}
          />
        </Sheet>
      </div>

      {documents.filter(doc => Object.keys(doc.document_attributes).length > 0).length > 0 && (
        <div className='flex flex-col gap-4'>
          {documents
            .filter(doc => Object.keys(doc.document_attributes).length > 0)
            .map((doc, index) => {
              const hasError = errors[`document_attachments_attributes.${index}.document_attributes.type`] != null ||
                           errors[`document_attachments_attributes.${index}.document_attributes.file`] != null ||
                           doc.document_attributes.type === undefined ||
                           doc.document_attributes.file === undefined ||
                           errors[`document_attachments_attributes.${index}.document_attributes.year`] != null ||
                           errors[`document_attachments_attributes.${index}.document_attributes.missing_name`] != null

              return (
                <Sheet key={`document-${index}`}>
                  <div className={`flex items-center justify-between p-4 border rounded-lg ${hasError ? 'bg-red-50 border-red-600' : 'bg-white'}`}>
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
                    errors={errors}
                    onUpdate={(attribute, value) => updateDocumentAttribute(index, attribute, value)}
                  />
                </Sheet>
              )
            })}
        </div>
      )}
    </div>
  )
}
