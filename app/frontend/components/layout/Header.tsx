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
import LogInIcon from "/assets/icons/login.svg?react";
import SearchIcon from "/assets/icons/search.svg?react";
import FistIcon from "/assets/icons/fist.svg?react";

const navLinks = [
  {
    title: "Trouver une association",
    href: "/inertia-example",
    icon: SearchIcon,
  },
  {
    title: "Qui sommes-nous ?",
    href: "/qui-nous-sommes",
    icon: FistIcon,
  },
];

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
            {navLinks.map((link) => (
              <NavigationMenuItem
                key={link.href}
                className="hover:bg-background py-2 px-4 rounded-md"
              >
                <NavigationMenuLink asChild>
                  <Link href={link.href} className="flex gap-2 items-center">
                    <link.icon className="filter invert-[17%] sepia-[12%] saturate-[4287%] hue-rotate-[137deg] brightness-[91%] contrast-[103%]" />
                    {link.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
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
            <LogInIcon />
            Se connecter
          </Link>
        </div>
      </div>
      <nav className={"w-full mt-4 lg:hidden" + (active ? "" : " hidden")}>
        <ul className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center justify-center w-full py-2 px-4 hover:bg-background rounded-md"
              >
                <link.icon className="filter invert-[17%] sepia-[12%] saturate-[4287%] hue-rotate-[137deg] brightness-[91%] contrast-[103%]" />
                {link.title}
              </Link>
            </li>
          ))}
          <li className="sm:hidden flex justify-center pt-2">
            <Link
              href="#login"
              className={`${buttonVariants({
                variant: "default",
              })} justify-center`}
            >
              <LogInIcon />
              Se connecter
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
