import { ReactElement } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
// @ts-expect-error
import GoodIdea from '@/assets/icons/good-idea.svg?react'
import MyFileInput from '@/components/shared/MyFileInput'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'
import { OsblCreationData } from '@/pages/Contribution/types'

// Props interface for the dialog component
interface ContributionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: string
  files: File[]
  setContributionField: (field: keyof OsblCreationData['contribution'], value: OsblCreationData['contribution'][keyof OsblCreationData['contribution']]) => void
  onConfirm: () => void
  error: string | undefined
  clearError: () => void
  processing: boolean
}

export default function ContributionDialog ({
  open,
  onOpenChange,
  comment,
  files,
  setContributionField,
  onConfirm,
  error,
  clearError,
  processing
}: ContributionDialogProps): ReactElement {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>
            Enregistrer votre contribution
          </DialogTitle>
          <DialogDescription className='sr-only'>
            Enregistrez votre contribution pour la soumettre à la modération.
          </DialogDescription>
        </DialogHeader>
        <Alert className='mt-4'>
          <GoodIdea className='min-w-8 min-h-8' />
          <AlertDescription>
            Pour que votre contribution soit validée, le modérateur doit pouvoir
            vérifier les informations fournies. Facilitez son travail en
            indiquant clairement vos sources !
          </AlertDescription>
        </Alert>
        <div className='mt-8 gap-8 flex flex-col w-full'>
          <div className='flex flex-col gap-4'>
            <Label htmlFor='comment' className=''>
              Commentaire :
            </Label>
            <Textarea
              id='comment'
              placeholder='Fournissez vos sources, les liens webs qui vous ont servi de référence, ...'
              value={comment}
              onChange={(e) => setContributionField('body', e.target.value)}
              className='bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-auto flex-grow h-40'
            />
          </div>
          <div className='flex flex-col gap-4'>
            <MyFileInput
              id='files'
              labelText='Fichiers complémentaires :'
              multiple
              onChange={(selectedFiles) => {
                setContributionField('files', selectedFiles as unknown as File[])
                clearError()
              }}
              file={files}
              error={error}
            />
          </div>
        </div>
        <DialogFooter className='mt-8'>
          <Button onClick={onConfirm} disabled={processing}>
            <Save className='mr-2' />
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
