import { Link } from "@inertiajs/react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { buttonVariants } from "@/components/ui/button";

import SearchIcon from "/assets/icons/search.svg";
import FistIcon from "/assets/icons/fist.svg";

export default function Footer() {
  return (
    <footer className="flex flex-col bg-foreground text-white">
      <div className="2xl:container 2xl:mx-auto flex flex-col lg:flex-row gap-8 items-center px-8 py-8 lg:py-2 justify-center sm:justify-between">
        <Link href="/" className="flex gap-2 items-center">
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-bold leading-none">
              Benefactorum
            </h1>
            <h2 className="text-xs sm:text-sm leading-none text-slate-200">
              Association de bienfaiteurs
            </h2>
          </div>
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col sm:flex-row gap-2 sm:gap-4 lg:gap-16">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/inertia-example"
                  className="flex gap-2 items-center hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="18"
                    className="fill-white"
                  >
                    <path
                      stroke="#033"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.5 17a8 8 0 1 0 0-16 8 8 0 0 0 0 16"
                    />
                    <path
                      stroke="#033"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7.885 11.462a3.077 3.077 0 1 0 0-6.154 3.077 3.077 0 0 0 0 6.153M12.192 12.692l-2.13-2.129"
                    />
                  </svg>
                  Trouver une association
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/posts"
                  className="flex gap-2 items-center hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    className="fill-white"
                  >
                    <path
                      stroke="#033"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.959 15.322v-2.815c-1.49-.518-2.491-2.253-2.491-4.29C2.468 7 2.74 5.73 4.09 5.73h3.42a1.27 1.27 0 0 1 .368 2.485l-1.955.593c1 0 2.228.949 2.201 2.178m3.593 4.337v-2.817s.67-.335 1.372-1.006c1.35-1.292 1.526-3.336 1.16-5.169-.121-.61-.295-1.23-.544-1.75M3.55 5.648V3.493a1.69 1.69 0 0 1 3.379 0v2.155"
                    />
                    <path
                      stroke="#033"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.929 5.204V2.368a1.69 1.69 0 0 1 3.38 0v2.836a1.69 1.69 0 0 1-1.558 1.685m1.559-3.396a1.69 1.69 0 0 1 3.38 0v1.451a1.69 1.69 0 1 1-3.38 0z"
                    />
                  </svg>
                  Qui sommes-nous ?
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-2">
          <a
            href="https://www.facebook.com/benefactorum/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonVariants({
              size: "icon",
            })} bg-white w-6 h-6`}
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-foreground"
            >
              <title>Facebook</title>
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/benefactorum_org/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonVariants({
              size: "icon",
            })} bg-white w-6 h-6`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="fill-foreground"
            >
              <path d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388 5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552 1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388 5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912.056-1.28.07-1.69.063-4.948-.006-3.258-.02-3.667-.081-4.947-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123 5.86 5.86 0 0 0-2.128-1.38C19.074.322 18.202.12 16.924.066 15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895 3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228-.06-1.264-.072-1.644-.08-4.848-.006-3.204.006-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417 1.265-.06 1.644-.072 4.848-.08 3.203-.006 3.583.006 4.85.062 1.168.05 1.804.244 2.227.408.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227.06 1.265.074 1.645.08 4.848.005 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.23-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008" />
            </svg>
          </a>
          <a
            href="https://github.com/Benefactorum/app"
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonVariants({
              size: "icon",
            })} bg-white w-6 h-6`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="fill-foreground"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/company/benefactorum/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonVariants({
              size: "icon",
            })} bg-white w-6 h-6`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="fill-foreground"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
            </svg>
          </a>
        </div>
      </div>
      <p className="mx-auto flex text-center text-xs text-slate-200">
        2024 - &nbsp;
        <Link href="/" className="hover:underline">
          Mentions légales
        </Link>
        &nbsp;-&nbsp;
        <Link href="/" className="hover:underline">
          Données personnelles
        </Link>
      </p>
    </footer>
  );
}
