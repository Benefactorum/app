import { useState, useEffect, ReactElement } from 'react'
import { useForm, router } from '@inertiajs/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Pencil, Trash2, AlertCircle } from 'lucide-react'

interface UserAvatarProps {
  userId: number
  hasProfilePicture: boolean
}

export default function UserAvatarEdit ({
  userId,
  hasProfilePicture
}: UserAvatarProps): ReactElement {
  const { data, setData, patch, processing, errors, clearErrors, hasErrors } = useForm({
    profile_picture: null as File | string | null
  })
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [activeStorage, setActiveStorage] = useState<typeof import('@rails/activestorage') | null>(null)

  useEffect(() => {
    void (async () => {
      const module = await import('@rails/activestorage')
      module.start()
      setActiveStorage(module)
    })()
  }, [])

  function submit (e: React.FormEvent): void {
    e.preventDefault()

    if (
      activeStorage === null ||
      data.profile_picture === null ||
      !(data.profile_picture instanceof File)
    ) { return }

    const upload = new activeStorage.DirectUpload(
      data.profile_picture,
      '/rails/active_storage/direct_uploads?subfolder=profile_pictures',
      {
        directUploadWillStoreFileWithXHR: (request) => {
          request.upload.addEventListener('progress', (event: ProgressEvent) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100
              setUploadProgress(progress)
            }
          })
        }
      }
    )

    upload.create((error, blob) => {
      setUploadProgress(null)
      if (error !== null) {
        toast.error(
          "Une erreur est survenue lors de l'enregistrement de votre photo de profil."
        )
      } else {
        data.profile_picture = blob.signed_id
        patch(`/users/${userId}/profile_picture`, {
          onSuccess: () => {
            if (errors.profile_picture === undefined) {
              toast.success('Votre photo de profil a été mise à jour avec succès.')
            }
          }
        })
      }
    })
  }

  function destroy (): void {
    router.delete(`/users/${userId}/profile_picture`, {
      onSuccess: () => {
        toast.success('Votre photo de profil a été supprimée.')
      }
    })
  }

  return (
    <AlertDialog>
      <Popover>
        <PopoverTrigger
          aria-label='Modifier la photo de profil'
          className={cn(
            buttonVariants({
              variant: 'secondary',
              size: 'icon'
            }),
            'hover:bg-foreground/100 hover:text-white absolute right-0 top-4 rounded-full'
          )}
        >
          <Pencil />
        </PopoverTrigger>
        <PopoverContent className='relative'>
          {hasProfilePicture && (
            <AlertDialogTrigger
              aria-label='Supprimer la photo de profil'
              className={`${buttonVariants({
                    variant: 'destructive'
                  })} absolute top-4 right-4 w-7 h-7`}
            >
              <Trash2 />
            </AlertDialogTrigger>
          )}

          <form onSubmit={submit} className='flex flex-col gap-4'>
            <Label className='text-xl' htmlFor='picture'>
              Photo de profil
            </Label>
            <div>
              <Input
                aria-label='Sélectionner une image'
                type='file'
                required
                onChange={(e) => {
                  const files = e.target.files
                  if (files == null) return
                  setData('profile_picture', files[0])
                  clearErrors('profile_picture')
                }}
              />
              {errors.profile_picture !== undefined && (
                <div className='flex items-center text-red-600 text-sm p-1'>
                  <AlertCircle className='w-4 h-4 mr-1' />
                  {errors.profile_picture}
                </div>
              )}
            </div>
            <Button
              type='submit'
              disabled={
                    uploadProgress !== null ||
                    processing ||
                    hasErrors
                  }
            >
              Mettre à jour
            </Button>
          </form>
          <Progress
            className={uploadProgress !== null ? 'mt-4' : 'hidden'}
            value={uploadProgress ?? 0}
          />
        </PopoverContent>
      </Popover>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>En êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous êtes sur le point de supprimer votre photo de profil.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Retour</AlertDialogCancel>
          <AlertDialogAction onClick={destroy}>
            Continuer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
