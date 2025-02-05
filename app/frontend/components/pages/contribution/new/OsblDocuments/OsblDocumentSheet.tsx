import { ReactElement, useRef, useState } from 'react'
import { Document, FormProps } from '@/pages/Contribution/types'
import { Button } from '@/components/ui/button'
import MyInput from '@/components/shared/MyInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import MyNumberInput from '@/components/shared/MyNumberInput'
import { Textarea } from '@/components/ui/textarea'
import MyFileInput from '@/components/shared/MyFileInput'
import { CheckIcon, ChevronDown, X } from 'lucide-react'
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import deepCleanData from '@/lib/deepCleanData'
import { z } from 'zod'
import { usePage } from '@inertiajs/react'
interface Props extends Omit<FormProps, 'data' | 'setData'> {
  document: Partial<Document>
  index: number
  onUpdate: (document: Document) => void
}

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_DOCUMENT_TYPES = ['application/pdf']

const documentValidation = z.object({
  file: z.instanceof(File)
    .refine((file) => {
      return file.size <= MAX_DOCUMENT_SIZE
    }, 'La taille du fichier doit être inférieure à 5 MB.')
    .refine((file) => {
      return ALLOWED_DOCUMENT_TYPES.includes(file.type)
    }, 'Le type de fichier est invalide. Format accepté : PDF.')
})

export default function OsblDocumentSheet ({
  document,
  index,
  onUpdate,
  errors,
  clearErrors,
  setError
}: Props): ReactElement {
  const documentTypes = usePage().props.document_types as string[]
  const formRef = useRef<HTMLFormElement>(null)
  const [sheetDocument, setSheetDocument] = useState<Partial<Document>>(document)
  const [isOpen, setIsOpen] = useState(() => {
    const checks = [
      (!['Rapport d\'activité', 'Rapport financier'].includes(sheetDocument.type ?? '') && sheetDocument.year !== undefined),
      (!['Procès verbal', 'Autre'].includes(sheetDocument.type ?? '') && sheetDocument.name !== undefined),
      sheetDocument.description !== undefined
    ]
    return checks.some(check => check)
  })

  function updateSheetDocument (field: keyof Document, value: any): void {
    setSheetDocument(prev => ({
      ...prev,
      [field]: value
    }))
  }

  function handleSubmit (e: React.MouseEvent<HTMLButtonElement>): void {
    if (formRef.current?.reportValidity() === false) {
      e.preventDefault()
      return
    }

    const result = documentValidation.safeParse({ file: sheetDocument.file })
    if (!result.success) {
      e.preventDefault()
      const errorMessage = result.error.issues[0].message
      setError(`document_attachments_attributes.${index}.document_attributes.file`, errorMessage)
      return
    }

    onUpdate(deepCleanData(sheetDocument))
  }

  return (
    <SheetContent className='w-full sm:max-w-[600px] overflow-y-auto'>
      <form ref={formRef}>
        <SheetHeader>
          <SheetTitle>Document</SheetTitle>
          <SheetDescription className='sr-only'>
            Renseignez les informations du document.
          </SheetDescription>
        </SheetHeader>

        <div className='flex flex-col gap-8 mt-8'>
          <div className='flex flex-col gap-4'>
            <Label>Type de document *</Label>
            <Select
              value={sheetDocument.type}
              onValueChange={(value) => updateSheetDocument('type', value)}
              required
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {['Rapport d\'activité', 'Rapport financier'].includes(sheetDocument.type ?? '') && (
            <MyNumberInput
              labelText='Année *'
              id={`document-year-${index}`}
              min={1000}
              max={new Date().getFullYear()}
              value={sheetDocument.year ?? ''}
              onChange={(e) => updateSheetDocument('year', e.target.value)}
              required
            />
          )}

          {['Procès verbal', 'Autre'].includes(sheetDocument.type ?? '') && (
            <MyInput
              labelText='Nom du document *'
              id={`document-name-${index}`}
              type='text'
              value={sheetDocument.name ?? ''}
              onChange={(e) => updateSheetDocument('name', e.target.value)}
              required
            />
          )}

          <div className='flex flex-col gap-2'>
            <MyFileInput
              file={sheetDocument.file ?? undefined}
              labelText='Fichier *'
              id={`document-file-${index}`}
              onChange={(file) => {
                updateSheetDocument('file', file)
                clearErrors(`document_attachments_attributes.${index}.document_attributes.file`)
              }}
              accept='.pdf'
              error={errors[`document_attachments_attributes.${index}.document_attributes.file`]}
              required
            />
          </div>

          {/* Collapsible section with isOpen state */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <div className='flex justify-between items-center cursor-pointer text-muted-foreground hover:text-muted-foreground/80'>
                <span>Informations additionnelles</span>
                <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className='CollapsibleContent'>
              <div className='flex flex-col gap-8 mt-8'>
                {!['Procès verbal', 'Autre'].includes(sheetDocument.type ?? '') && (
                  <MyInput
                    labelText='Nom du document'
                    id={`document-name-${index}`}
                    type='text'
                    value={sheetDocument.name ?? ''}
                    onChange={(e) => updateSheetDocument('name', e.target.value)}
                  />
                )}

                {!['Rapport d\'activité', 'Rapport financier'].includes(sheetDocument.type ?? '') && (
                  <MyNumberInput
                    id={`document-year-${index}`}
                    labelText='Année'
                    min={1000}
                    max={new Date().getFullYear()}
                    value={sheetDocument.year ?? ''}
                    onChange={(e) => updateSheetDocument('year', e.target.value)}
                  />
                )}

                <div className='flex flex-col gap-4'>
                  <label htmlFor={`document-description-${index}`} className='text-sm font-medium'>
                    Description du document
                  </label>
                  <Textarea
                    id={`document-description-${index}`}
                    value={sheetDocument.description ?? ''}
                    maxLength={300}
                    onChange={(e) => updateSheetDocument('description', e.target.value)}
                    className='bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-full h-40'
                  />
                  <div className='text-xs text-right'>
                    {(sheetDocument.description ?? '').length}/300 caractères
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <SheetFooter className='mt-16 gap-y-2'>
          <SheetClose asChild>
            <Button variant='ghost' size='lg'>
              <X className='mr-2' />
              Annuler
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button onClick={handleSubmit} variant='default' size='lg'>
              <CheckIcon className='mr-2' />
              Valider
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  )
}
