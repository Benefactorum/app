import { useState, useEffect, ReactElement } from 'react'
import { useForm, router } from '@inertiajs/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { validate } from '@/lib/validate'
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
import { Pencil, Trash2 } from 'lucide-react'
import { z } from 'zod'
import MyFileInput from '@/components/shared/MyFileInput'
import getAllowedFormats from '@/lib/getAllowedFormats'

const ALLOWED_CONTENT_TYPES = ['image/png', 'image/jpg', 'image/webp', 'image/jpeg']
const MAX_PROFILE_PICTURE_SIZE = 1 * 1024 * 1024 // 1MB

const profilePicSchema = z.object({
  profile_picture: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_PROFILE_PICTURE_SIZE, 'La taille du fichier doit être inférieure à 1 MB.')
    .refine((file) => ALLOWED_CONTENT_TYPES.includes(file.type), `Le type de fichier est invalide. Format accepté : ${getAllowedFormats(ALLOWED_CONTENT_TYPES)}.`)
})

interface UserAvatarProps {
  userId: number
  hasProfilePicture: boolean
}

export default function UserAvatarEdit ({
  userId,
  hasProfilePicture
}: UserAvatarProps): ReactElement {
  const { data, setData, patch, processing, errors, setError, clearErrors, hasErrors } = useForm({
    profile_picture: '' as File | string
  })
  const [activeStorage, setActiveStorage] = useState<typeof import('@rails/activestorage') | null>(null)
  const [open, setOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  useEffect(() => {
    void (async () => {
      const module = await import('@rails/activestorage')
      module.start()
      setActiveStorage(module)
    })()
  }, [])

  function submit (e: React.FormEvent): void {
    e.preventDefault()

    if (!validate(profilePicSchema, data, setError)) {
      return
    }

    if (activeStorage === null) {
      toast.error('Une erreur est survenue. Veuillez rafraîchir la page.')
      return
    }

    const upload = new activeStorage.DirectUpload(
      data.profile_picture as File,
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
        toast.error("Une erreur est survenue lors de l'enregistrement de votre photo de profil.")
      } else {
        data.profile_picture = blob.signed_id
        patch(`/users/${userId}/profile_picture`, {
          onSuccess: () => {
            if (!hasErrors) {
              setOpen(false)
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
        setOpen(false)
        toast.success('Votre photo de profil a été supprimée.')
      }
    })
  }

  return (
    <AlertDialog>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-label='Modifier la photo de profil'
          className={cn(
            buttonVariants({ variant: 'secondary', size: 'icon' }),
            'hover:bg-foreground/100 hover:text-white absolute right-0 top-4 rounded-full'
          )}
        >
          <Pencil />
        </PopoverTrigger>
        <PopoverContent className='relative'>
          {hasProfilePicture && (
            <AlertDialogTrigger
              aria-label='Supprimer la photo de profil'
              className={cn(
                buttonVariants({ variant: 'destructive' }),
                'absolute top-2 right-2 w-7 h-7'
              )}
            >
              <Trash2 />
            </AlertDialogTrigger>
          )}
          <form onSubmit={submit} className='flex flex-col gap-4'>
            <MyFileInput
              labelText='Photo de profil'
              id='profile_picture'
              required
              accept='image/png, image/webp, image/jpg'
              onChange={(file) => {
                setData('profile_picture', file as File)
                clearErrors('profile_picture')
              }}
              error={errors.profile_picture}
            />
            <Button
              type='submit'
              disabled={uploadProgress !== null || processing || hasErrors}
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
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={destroy}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
