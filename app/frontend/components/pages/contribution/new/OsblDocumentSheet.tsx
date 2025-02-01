import { ReactElement, RefObject, useRef } from 'react'
import { Document } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
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
import MyFileInput from '@/components/shared/MyFileInput'
import { CheckIcon, ChevronDown } from 'lucide-react'
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import InputError from '@/components/forms/InputError'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'

interface Props {
  document: Partial<Document>
  index: number
  errors: Record<string, string>
  onUpdate: (attribute: keyof Document, value: any) => void
  submitLabel?: string
  title?: string
}

const DocumentTypeList = [
  { value: 'statuts', label: 'Statuts' },
  { value: 'rapport_activite', label: "Rapport d'activité" },
  { value: 'rapport_financier', label: 'Rapport financier' },
  { value: 'proces_verbal', label: 'Procès verbal' },
  { value: 'autre', label: 'Autre' }
]

export default function OsblDocumentSheet ({
  document,
  index,
  errors,
  onUpdate,
  submitLabel = 'Valider',
  title = 'Document'
}: Props): ReactElement {
  const formRef = useRef<HTMLFormElement>(null) as React.RefObject<HTMLFormElement>
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit (e: React.MouseEvent<HTMLButtonElement>): void {
    if (!formRef.current.reportValidity()) {
      e.preventDefault()
    }
  }

  return (
    <SheetContent className='w-full sm:max-w-[600px] overflow-y-auto'>
      <form ref={formRef}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className='sr-only'>
            Renseignez les informations du document.
          </SheetDescription>
        </SheetHeader>

        <div className='flex flex-col gap-8 mt-8'>
          <div className='flex flex-col gap-4'>
            <Label>Type de document *</Label>
            <Select
              value={document.type}
              onValueChange={(value) => onUpdate('type', value)}
              required
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DocumentTypeList.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[`document_attachments_attributes.${index}.document_attributes.type`] !== undefined && (
              <InputError>
                {errors[`document_attachments_attributes.${index}.document_attributes.type`]}
              </InputError>
            )}
          </div>

          {['rapport_activite', 'rapport_financier'].includes(document.type ?? '') && (
            <MyNumberInput
              labelText='Année *'
              id={`document-year-${index}`}
              min={1000}
              max={new Date().getFullYear()}
              value={document.year ?? ''}
              onChange={(e) => onUpdate('year', e.target.value)}
              required
              error={errors[`document_attachments_attributes.${index}.document_attributes.year`]}
            />
          )}

          {['proces_verbal', 'autre'].includes(document.type ?? '') && (
            <MyInput
              labelText='Nom du document *'
              id={`document-name-${index}`}
              type='string'
              value={document.name ?? ''}
              onChange={(e) => onUpdate('name', e.target.value)}
              required
              error={errors[`document_attachments_attributes.${index}.document_attributes.name`]}
            />
          )}

          <div className='flex flex-col gap-2'>
            <MyFileInput
              ref={inputRef as RefObject<HTMLInputElement>}
              labelText='Fichier *'
              id={`document-file-${index}`}
              placeholder='Sélectionner un fichier *'
              onChange={(e) => onUpdate('file', e.target.files?.[0])}
              accept='.pdf'
              required
              error={errors[`document_attachments_attributes.${index}.document_attributes.file`]}
            />
            {
              document.file !== undefined && (inputRef.current?.files?.[0] === undefined) && (
                <div className='flex items-center gap-2 justify-center'>
                  <CheckIcon className='text-primary' />
                  <p className='text-sm text-muted-foreground'>{document.file.name}</p>
                </div>
              )
            }
          </div>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <div className='flex justify-between items-center cursor-pointer text-muted-foreground hover:text-muted-foreground/80'>
                <span>Informations additionnelles</span>
                <ChevronDown className='h-4 w-4' />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className='mt-8 flex flex-col gap-8'>
              {!['proces_verbal', 'autre'].includes(document.type ?? '') && (
                <MyInput
                  labelText='Nom du document'
                  id={`document-name-${index}`}
                  type='string'
                  value={document.name ?? ''}
                  onChange={(e) => onUpdate('name', e.target.value)}
                />
              )}

              {!['rapport_activite', 'rapport_financier'].includes(document.type ?? '') && (
                <MyNumberInput
                  id={`document-year-${index}`}
                  labelText='Année'
                  min={1000}
                  max={new Date().getFullYear()}
                  value={document.year ?? ''}
                  onChange={(e) => onUpdate('year', e.target.value)}
                />
              )}

              <div className='space-y-2'>
                <label htmlFor={`document-description-${index}`} className='text-sm font-medium'>
                  Description du document
                </label>
                <Textarea
                  id={`document-description-${index}`}
                  value={document.description ?? ''}
                  onChange={(e) => onUpdate('description', e.target.value)}
                  className='bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-full h-40'
                />
                <div className={`text-xs text-right ${(document.description ?? '').length > 300 ? 'text-red-600' : 'text-gray-500'}`}>
                  {(document.description ?? '').length}/300 caractères
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={(e) => handleSubmit(e)} variant='default' size='lg' className='mx-auto mt-8'>
              <CheckIcon className='mr-2' />
              {submitLabel}
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  )
}
