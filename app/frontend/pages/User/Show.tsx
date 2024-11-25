import { Head } from "@inertiajs/react";

import Donor from "/assets/images/joinUs/donor.webp";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { Link } from "@inertiajs/react";
import { buttonVariants } from "@/components/ui/button";
import { Settings } from "lucide-react";

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

const imageDescription =
  "Icône d'une main déposant une pièce dans une boîte de don ornée d'un cœur, symbolisant la générosité, le soutien aux causes sociales et l'engagement dans les actions caritatives.";

export default function Show({ user }) {

  return (
    <>
      <Head>
        <title>Tableau de bord</title>
        <meta name="description" content="Your page description" />
      </Head>
      <div className="flex flex-col-reverse md:flex-row py-8 lg:py-16 2xl:container mx-auto px-2 sm:px-8 gap-8 lg:gap-16">
        <div className="hidden md:flex md:w-1/3 justify-center items-center">
          <div className="w-[200px] lg:w-[300px]">
            <AspectRatio ratio={300 / 284.48}>
              <img
                src={Donor}
                alt={imageDescription}
                title={imageDescription}
              />
            </AspectRatio>
          </div>
        </div>
        <div className="flex flex-grow xl:flex-none md:w-2/3 flex-col justify-center gap-8">
          <div className="flex gap-4">
            <h1 className=" text-2xl sm:text-3xl lg:text-4xl whitespace-pre-line font-semibold">
              <span className="leading-snug">
                {user.first_name} {user.last_name}
              </span>
            </h1>
            <div className="flex items-center space-x-2">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <link.icon className="w-5 h-5 fill-primary rounded-sm hover:fill-foreground" />
                </a>
              ))}
            </div>
          </div>
          <div className="md:hidden flex my-4 mx-auto">
            <div className="w-[150px]">
              <AspectRatio ratio={300 / 284.48}>
                <img
                  src={Donor}
                  alt={imageDescription}
                  title={imageDescription}
                />
              </AspectRatio>
            </div>
          </div>
          <p>
            Inscrit depuis le <FormattedDate isoDate={user.created_at} />.
          </p>
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
        </div>
      </div>
    </>
  );
}
