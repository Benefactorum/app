import { Head, router, useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"

// doesn't work with SSR
// import { DirectUpload } from "@rails/activestorage"

import { toast } from "sonner";


import NoProfilePicture from "@/assets/images/user/no-profile-picture.svg";
import { Settings, Pencil, Trash2, AlertCircle } from "lucide-react";
import Facebook from "/assets/icons/facebook.svg?react";
// @ts-ignore
import Instagram from "/assets/icons/instagram.svg?react";
// @ts-ignore
import Github from "/assets/icons/github.svg?react";
// @ts-ignore
import Linkedin from "/assets/icons/linkedin.svg?react";

import FormattedDate from '@/components/FormattedDate';

import { CurrentUserType, ProfilePictureUrlType } from '@/pages/types'

const socialLinks = [
  {
    href: "",
    icon: Facebook,
  },
  {
    href: "",
    icon: Instagram,
  },
  {
    href: "",
    icon: Github,
  },
  {
    href: "",
    icon: Linkedin,
  },
];

interface IndexProps {
  user: UserType
  profile_picture_url: ProfilePictureUrlType
  currentUser: CurrentUserType
}

export default function Show({ user, profile_picture_url, currentUser }: IndexProps) {
  const { data, setData, patch, processing, errors } = useForm({
    profile_picture: null,
  })
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [activeStorage, setActiveStorage] = useState(null);

  useEffect(() => {
    async function loadActiveStorage() {
      const module = await import('@rails/activestorage');
      module.start();
      setActiveStorage(module);
    }

    loadActiveStorage();
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    const upload = new activeStorage.DirectUpload(
      data.profile_picture,
      `/rails/active_storage/direct_uploads?subfolder=profile_pictures`,
      {
        directUploadWillStoreFileWithXHR: (request) => {
          request.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100;
              setUploadProgress(progress);
            }
          });
        },
      }
    );

    upload.create((error, blob) => {
      setUploadProgress(null);
      if (error) {
        toast.error(
          "Une erreur est survenue lors de l'enregistrement de votre photo de profil. Veuillez réessayer."
        );
      } else {
        data.profile_picture = blob.signed_id;
        patch(`/users/${user.id}/profile_picture`, {
          onSuccess: () => {
            if (!errors.profile_picture) {
              toast.success(
                "Votre photo de profil a été mise à jour avec succès."
              );
            }
          },
        });
      }
    });
  }

  function destroy() {
    router.delete(`/users/${user.id}/profile_picture`, {
      onSuccess: () => {
        toast.success("Votre photo de profil a été supprimée.")
      }
    })
  }

  return (
    <>
      <Head>
        <title>Tableau de bord</title>
        <meta name="description" content="Your page description" />
      </Head>
      <div className="w-full mx-auto flex flex-wrap py-8 lg:py-16 2xl:container px-2 sm:px-8 gap-8">
        <div className="mx-auto relative flex justify-center items-center">
          <img
            alt="avatar de profil"
            className="w-[212px] h-[212px] rounded-full object-cover"
            src={profile_picture_url || NoProfilePicture}
          />
          {user.id === currentUser?.id &&
            <AlertDialog>
              <Popover>
                <PopoverTrigger className="flex bg-secondary w-10 h-10 justify-center items-center hover:bg-foreground/100 hover:text-white absolute right-0 top-4 rounded-full">
                  <Pencil />
                </PopoverTrigger>
                <PopoverContent className="relative">
                  {profile_picture_url &&
                    <AlertDialogTrigger className="absolute top-4 right-4">
                      <Button variant="destructive" className="w-7 h-7">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                  }

                  <form onSubmit={submit} className="flex flex-col gap-4">
                    <Label className='text-xl' htmlFor="picture">Photo de profil</Label>
                    <div>
                      <Input type="file" required className=''
                        onChange={(e) => {
                          setData("profile_picture", e.target.files[0]);
                          errors.profile_picture = null;
                        }} />
                      {errors.profile_picture && (
                        <div className="flex items-center text-red-600 text-sm rounded-md p-1">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.profile_picture}
                        </div>
                      )}
                    </div>
                    <Button type="submit" disabled={uploadProgress || processing || !!errors.profile_picture}>Mettre à jour</Button>
                  </form>
                  <Progress className={uploadProgress ? 'mt-4' : ' hidden'} value={uploadProgress} />

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
                  <AlertDialogAction onClick={destroy}>Continuer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          }
        </div>
        <div className="mx-auto flex">
          <div className="mx-auto flex flex-col justify-center gap-4">

            <div className="flex flex-col gap-4 md:flex-row">
              <h1 className=" text-2xl sm:text-3xl lg:text-4xl whitespace-pre-line font-semibold">
                <span className="leading-snug">
                  {user.first_name} {user.last_name}
                </span>
              </h1>
              <div className="flex items-center space-x-2">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <link.icon className="w-5 h-5 fill-primary rounded-sm hover:fill-foreground" />
                  </a>
                ))}
              </div>
            </div>
            <p>
              Inscrit depuis le <FormattedDate isoDate={user.created_at} />.
            </p>
            {user.id === currentUser?.id &&
              <p>
                Profil complété à 20 %.
              </p>
            }
            <p>
              0 points d'impact.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center ml-auto gap-8">
          {user.id === currentUser?.id &&
            <div className="flex justify-end">
              <Link
                href=""
                className={`${buttonVariants({
                  size: "lg",
                })}`}
              >
                <Settings />
                Mes paramètres
              </Link>
            </div>
          }
        </div>
      </div>
    </>
  );
}
