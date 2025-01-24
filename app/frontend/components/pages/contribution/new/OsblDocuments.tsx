import { ReactElement } from 'react'
import { FormProps, DocumentRecord } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import { PlusIcon, TrashIcon, ChevronDown } from 'lucide-react'
import MyInput from '@/components/forms/MyInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import MyNumberInput from '@/components/forms/MyNumberInput'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const DocumentTypeList = [
  { value: 'statuts', label: 'Statuts' },
  { value: 'rapport_activite', label: 'Rapport d\'activité' },
  { value: 'rapport_financier', label: 'Rapport financier' },
  { value: 'procès_verbal', label: 'Procès verbal' },
  { value: 'autre', label: 'Autre' }
]

export default function OsblDocuments ({ data, setData }: Pick<FormProps, 'data' | 'setData'>): ReactElement {
  const documents = data.document_attachments_attributes ?? []

  function handleDocumentChange (
    index: number,
    field: keyof DocumentRecord,
    value: any
  ): void {
    const updatedDocuments = documents.map((doc, i: number) =>
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
  }

  function handleAdd (e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    const newDocument = {
      document_attributes: {
        type: undefined,
        name: undefined,
        file: undefined
      }
    }
    setData('document_attachments_attributes', [...documents, newDocument])
  }

  function handleRemove (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ): void {
    e.preventDefault()
    const updatedDocuments = documents.filter((_, i) => i !== index)
    setData('document_attachments_attributes', updatedDocuments)
  }

  function handleFileChange (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const file = event.target.files?.[0]
    if (file != null) {
      handleDocumentChange(index, 'file', file)
    }
  }

  return (
    <div className='flex flex-wrap gap-16 mx-auto justify-center'>
      <div className='bg-white w-full sm:w-auto rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col'>
        <div className='flex gap-16 items-center justify-between'>
          <h2 className='text-2xl font-semibold'>Documents</h2>
          <Button onClick={handleAdd}>
            <PlusIcon className='w-4 h-4 mr-2' />
            Ajouter
          </Button>
        </div>

        <div className='flex flex-col gap-4'>
          {documents?.map((doc, index) => (
            <Card
              key={`document-${doc.document_attributes?.type ?? 'new'}-${index}`}
              className='bg-background'
            >
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-16 flex-1'>
                  <Select
                    value={doc.document_attributes?.type}
                    onValueChange={(value) => handleDocumentChange(index, 'type', value)}
                    required
                  >
                    <SelectTrigger className='w-60'>
                      <SelectValue placeholder='Type de document *' />
                    </SelectTrigger>
                    <SelectContent>
                      {DocumentTypeList.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={(e) => handleRemove(e, index)}
                    variant='ghost'
                    className='text-red-500 hover:text-red-700 p-0 h-auto'
                  >
                    <TrashIcon className='w-4 h-4' />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className='flex flex-col gap-4'>
                {['rapport_activite', 'rapport_financier'].includes(doc.document_attributes?.type ?? '') && (
                  <MyNumberInput
                    id={`document-year-${index}`}
                    min={1000}
                    max={new Date().getFullYear()}
                    value={doc.document_attributes?.year ?? ''}
                    onChange={(e) => handleDocumentChange(index, 'year', e.target.value)}
                    placeholder='Année *'
                    required
                  />
                )}

                <MyInput
                  type='file'
                  id={`document-file-${index}`}
                  placeholder='Sélectionner un fichier *'
                  onChange={(e) => handleFileChange(index, e)}
                  required
                />
                <Collapsible>
                  <CollapsibleTrigger className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'>
                    <ChevronDown className='h-4 w-4' />
                    Informations additionnelles
                  </CollapsibleTrigger>

                  <CollapsibleContent className='space-y-4 pt-4'>
                    <MyInput
                      type='string'
                      id={`document-name-${index}`}
                      placeholder='Nom du document'
                      value={doc.document_attributes?.name ?? ''}
                      onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                    />

                    {!['rapport_activite', 'rapport_financier'].includes(doc.document_attributes?.type ?? '') && (
                      <MyNumberInput
                        id={`document-year-${index}`}
                        min={1000}
                        max={new Date().getFullYear()}
                        value={doc.document_attributes?.year ?? ''}
                        onChange={(e) => handleDocumentChange(index, 'year', e.target.value)}
                        placeholder='Année'
                      />
                    )}

                    <div className='flex flex-col gap-2'>
                      <Textarea
                        id={`document-description-${index}`}
                        placeholder='Description du document'
                        value={doc.document_attributes?.description ?? ''}
                        onChange={(e) => {
                          handleDocumentChange(index, 'description', e.target.value)
                        }}
                        className='bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-full h-40'
                      />
                      <div className={`text-xs text-right ${(doc.document_attributes?.description ?? '').length > 300 ? 'text-red-600' : 'text-gray-500'}`}>
                        {(doc.document_attributes?.description ?? '').length}/300 caractères
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>

  )
}
