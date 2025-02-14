import { ReactElement, ChangeEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
// @ts-expect-error
import GoodIdea from '@/assets/icons/good-idea.svg?react'
import MyFileInput from '@/components/shared/MyFileInput'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'
import { ContributionData } from '@/pages/Contribution/types'

interface ContributionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contribution: ContributionData
  setContributionField: (
    field: keyof ContributionData,
    value: ContributionData[keyof ContributionData]
  ) => void
  onConfirm: () => void
  error: string | undefined
  clearError: () => void
  processing: boolean
}

export default function ContributionDialog ({
  open,
  onOpenChange,
  contribution,
  setContributionField,
  onConfirm,
  error,
  clearError,
  processing
}: ContributionDialogProps): ReactElement {
  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setContributionField('body', e.target.value)
  }

  const handleFileChange = (file: File | File[] | undefined): void => {
    if (file === undefined) {
      setContributionField('files', [])
    } else if (Array.isArray(file)) {
      setContributionField('files', file)
    } else {
      setContributionField('files', [file])
    }
    clearError()
  }

  const getFile = (): File[] | string | undefined => {
    if (contribution.files === undefined) {
      return undefined
    }

    // Check if files is an object with numeric keys and has filename/url properties
    if (typeof contribution.files === 'object' && !Array.isArray(contribution.files)) {
      console.log('files is an object', contribution.files)
      return Object.values(contribution.files).map((file: any) => file.filename).join(', ')
    }

    // Handle regular File[] case
    return Array.isArray(contribution.files) && contribution.files.length > 0
      ? contribution.files
      : undefined
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>Enregistrer votre contribution</DialogTitle>
          <DialogDescription className='sr-only'>
            Enregistrez votre contribution pour la soumettre à la modération.
          </DialogDescription>
        </DialogHeader>

        <Alert className='mt-4'>
          <GoodIdea className='min-w-8 min-h-8' />
          <AlertDescription>
            Pour que votre contribution soit validée, le modérateur doit pouvoir vérifier les informations fournies. Facilitez son travail en indiquant clairement vos sources !
          </AlertDescription>
        </Alert>

        <div className='mt-8 gap-8 flex flex-col w-full'>
          <div className='flex flex-col gap-4'>
            <Label htmlFor='comment'>Commentaire :</Label>
            <Textarea
              id='comment'
              placeholder='Fournissez vos sources, les liens webs qui vous ont servi de référence, ...'
              value={contribution.body}
              onChange={handleCommentChange}
              className='bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-auto flex-grow h-40'
            />
          </div>
          <div className='flex flex-col gap-4'>
            <MyFileInput
              id='files'
              labelText='Fichiers complémentaires :'
              multiple
              onChange={handleFileChange}
              file={getFile()}
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
