import { Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { Spin as Hamburger } from "hamburger-react";
import { CirclePlus, HeartHandshake, Bird } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignInModal from "@/components/layout/SignInModal";

import Logo from "/assets/logo.svg";
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

const subNavLinks = [
  {
    title: "Nous rejoindre",
    href: "/nous-rejoindre",
    icon: HeartHandshake,
  },
  {
    title: "Notre équipe",
    href: "/co-fondateurs",
    icon: Bird,
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
        <NavigationMenu className="hidden min-[1100px]:flex">
          <NavigationMenuList className="xl:gap-8">
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
            <NavigationMenuItem className="py-2 px-4 rounded-md hover:bg-secondary/50 focus-visible:bg-secondary">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex gap-2 items-center outline-none">
                  <CirclePlus className="w-4 h-4 text-foreground" />
                  Plus
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-4 flex flex-col gap-2">
                  {subNavLinks.map((link) => (
                    <DropdownMenuItem
                      key={link.href}
                      className={
                        "text-base py-2 px-4 rounded-md" +
                        (url === link.href
                          ? " bg-secondary focus:bg-secondary"
                          : " hover:bg-secondary/50 focus:bg-secondary/50")
                      }
                    >
                      <NavigationMenuLink asChild>
                        <Link
                          href={link.href}
                          className="flex gap-2 items-center"
                          onClick={handleLinkClick}
                        >
                          <link.icon className="text-foreground" />
                          {link.title}
                        </Link>
                      </NavigationMenuLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-4">
          <div className="min-[1100px]:hidden">
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
          <div className="hidden sm:flex">
            <SignInModal />
          </div>
        </div>
      </div>

      {/* Mobile Dropdown inside the header */}
      <div
        id="mobileDropdown"
        className={`min-[1100px]:hidden transition-all duration-700 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        } w-max mx-auto`}
      >
        <ul className="flex flex-col mt-4">
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
          <hr className="border-t border-gray-300 my-2" />
          {subNavLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={
                  "flex items-center justify-center gap-2 px-4 py-1 mb-1 rounded-md text-sm text-muted-foreground" +
                  (url === link.href
                    ? " bg-secondary"
                    : " hover:bg-secondary/50")
                }
                onClick={handleLinkClick}
              >
                <link.icon className="w-4 h-4 text-muted-foreground" />
                {link.title}
              </Link>
            </li>
          ))}
          <hr className="border-t border-gray-300 my-2" />
          <li className="sm:hidden flex justify-center">
            <div className="py-4 flex sm:hidden">
              <SignInModal />
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
}
