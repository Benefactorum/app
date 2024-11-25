import { Head, router, useForm, Link } from "@inertiajs/react";

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

import NoProfilePicture from "@/assets/images/user/no-profile-picture.svg?react";
import { Settings, Pencil, Trash2 } from "lucide-react";
import Facebook from "/assets/icons/facebook.svg?react";
// @ts-ignore
import Instagram from "/assets/icons/instagram.svg?react";
// @ts-ignore
import Github from "/assets/icons/github.svg?react";
// @ts-ignore
import Linkedin from "/assets/icons/linkedin.svg?react";

import FormattedDate from '@/components/FormattedDate';

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

type User = {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
};

type ProfilePicture = string | null;

type CurrentUser = {
  id: number;
  first_name: string;
  email: string;
};


export default function Show({ user, profile_picture, currentUser }: { user: User, profile_picture: ProfilePicture, currentUser: CurrentUser | null }) {
  const { data, setData, patch, processing } = useForm({
    profile_picture: null,
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    patch(`/users/${user.id}/profile_picture`, {
      onSuccess: () => {
        setData("profile_picture", null)
      }
    }
    )
  }

  function destroy() {
    router.delete(`/users/${user.id}/profile_picture`, {
      onSuccess: () => {
        setData("profile_picture", null)
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
          {profile_picture ?
            <img src={profile_picture} alt="avatar de profil" className="w-[212px] h-[212px] rounded-full object-cover" />
            :
            <NoProfilePicture className="mx-auto" />
          }
          {user.id === currentUser?.id &&
            <AlertDialog>
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="secondary"
                    className="hover:bg-foreground/100 hover:text-white absolute right-0 top-4 rounded-full"
                    size="icon"
                  >
                    <Pencil />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="relative">
                  {profile_picture &&
                    <AlertDialogTrigger className="absolute top-4 right-4">
                      <Button variant="destructive" className="w-7 h-7">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                  }

                  <form onSubmit={submit} className="flex flex-col gap-4">
                    <Label className='text-xl' htmlFor="picture">Photo de profil</Label>
                    <Input type="file" required className=''
                      onChange={(e) => {
                        setData("profile_picture", e.target.files[0]);
                      }} />
                    <Button type="submit" disabled={processing || data.profile_picture === null}>Mettre à jour</Button>
                  </form>
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
              0 dons - 0 contributions
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
