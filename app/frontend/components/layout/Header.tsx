import { Link } from "@inertiajs/react";
import { useState } from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { buttonVariants } from "@/components/ui/button";

import Logo from "/assets/logo.svg";
import SearchIcon from "/assets/icons/search.svg";
import FistIcon from "/assets/icons/fist.svg";
import LogInIcon from "/assets/icons/login.svg";

export default function Header() {
  const [active, setActive] = useState(false);

  return (
    <header className="bg-white py-2">
      <div className="2xl:container 2xl:mx-auto flex items-center px-2 justify-between">
        <Link href="/" className="flex gap-2 items-center">
          <img className="h-8 sm:h-12" src={Logo} alt="logo de Benefactorum" />
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-bold leading-none">
              Benefactorum
            </h1>
            <h2 className="text-xs sm:text-sm leading-none text-slate-600">
              Association de bienfaiteurs
            </h2>
          </div>
        </Link>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-8">
            <NavigationMenuItem className="hover:bg-background py-2 px-4 rounded-md">
              <NavigationMenuLink asChild>
                <Link href="/inertia-example">
                  <img
                    className="inline-block mr-1"
                    src={SearchIcon}
                    alt="icône de loupe"
                  />
                  Trouver une association
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="hover:bg-background py-2 px-4 rounded-md">
              <NavigationMenuLink asChild>
                <Link href="/posts">
                  <img
                    className="inline-block mr-1"
                    src={FistIcon}
                    alt="icône d'un poing tendu"
                  />
                  Qui sommes-nous ?
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActive(!active)}
            className={
              "hover:bg-background rounded-md lg:hidden flex flex-col items-center space-y-1.5 p-2" +
              (active ? " bg-background" : "")
            }
          >
            <span className="block w-6 h-0.5 bg-gray-800"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
          </button>
          <Link
            href="#login"
            className={`${buttonVariants({
              variant: "default",
            })} hidden sm:flex`}
          >
            <img
              className="inline-block mr-1"
              src={LogInIcon}
              alt="icône de loupe"
            />
            Se connecter
          </Link>
        </div>
      </div>
      <nav className={"w-full mt-4 lg:hidden" + (active ? "" : " hidden")}>
        <ul className="flex flex-col space-y-2">
          <li>
            <Link
              href="/inertia-example"
              className="flex items-center justify-center w-full py-2 px-4 hover:bg-background rounded-md"
            >
              <img
                className="inline-block mr-1"
                src={SearchIcon}
                alt="icône de loupe"
              />
              Trouver une association
            </Link>
          </li>
          <li>
            <Link
              href="/posts"
              className="flex items-center justify-center w-full py-2 px-4 hover:bg-background rounded-md"
            >
              <img
                className="inline-block mr-1"
                src={FistIcon}
                alt="icône d'un poing tendu"
              />
              Qui sommes-nous ?
            </Link>
          </li>
          <li className="sm:hidden flex justify-center pt-2">
            <Link
              href="#login"
              className={`${buttonVariants({
                variant: "default",
              })} justify-center`}
            >
              <img
                className="inline-block mr-1"
                src={LogInIcon}
                alt="icône de loupe"
              />
              Se connecter
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
