import { Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { Spin as Hamburger } from "hamburger-react";

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
  const [isOpen, setOpen] = useState(false);
  const { url } = usePage();
  const headerRef = useRef(null);

  const handleLinkClick = () => {
    setOpen(false);
  };

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header ref={headerRef} className="bg-white py-2">
      <div
        id="mainHeader"
        className="2xl:container 2xl:mx-auto flex items-center px-2 justify-between"
      >
        <Link
          href="/"
          className="flex gap-2 items-center"
          onClick={handleLinkClick}
        >
          <img className="h-8 sm:h-12" src={Logo} alt="logo de Benefactorum" />
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-bold leading-none sm:leading-none">
              Benefactorum
            </h1>
            <h2 className="text-xs sm:text-sm leading-none sm:leading-none text-slate-600">
              Association de bienfaiteurs
            </h2>
          </div>
        </Link>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-8">
            {navLinks.map((link) => (
              <NavigationMenuItem
                key={link.href}
                className={
                  "py-2 px-4 rounded-md" +
                  (url === link.href
                    ? " bg-secondary"
                    : " hover:bg-secondary/50")
                }
              >
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className="flex gap-2 items-center"
                    onClick={handleLinkClick}
                  >
                    <link.icon className="filter invert-[17%] sepia-[12%] saturate-[4287%] hue-rotate-[137deg] brightness-[91%] contrast-[103%]" />
                    {link.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-4">
          <div className="lg:hidden">
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
          <Link
            href="#login"
            className={`${buttonVariants({
              variant: "default",
            })} hidden sm:flex`}
            onClick={handleLinkClick}
          >
            <LogInIcon />
            Se connecter
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown inside the header */}
      <div
        id="mobileDropdown"
        className={`lg:hidden transition-all duration-700 ease-in-out overflow-hidden ${
          isOpen ? "max-h-36" : "max-h-0"
        } w-max mx-auto`}
      >
        <ul className="flex flex-col mt-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={
                  "flex items-center justify-center gap-2 px-4 py-2 mb-2 rounded-md" +
                  (url === link.href
                    ? " bg-secondary"
                    : " hover:bg-secondary/50")
                }
                onClick={handleLinkClick}
              >
                <link.icon className="filter invert-[17%] sepia-[12%] saturate-[4287%] hue-rotate-[137deg] brightness-[91%] contrast-[103%]" />
                {link.title}
              </Link>
            </li>
          ))}
          <li className="sm:hidden flex justify-center">
            <Link
              href="#login"
              className={`${buttonVariants({
                variant: "default",
              })} justify-center`}
              onClick={handleLinkClick}
            >
              <LogInIcon />
              Se connecter
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
