import { Link, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { Spin as Hamburger } from "hamburger-react";
import {
  Search,
  CirclePlus,
  HeartHandshake,
  Bird,
  HandHeart,
  HandMetal,
  LogIn,
  LogOut,
} from "lucide-react";

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
import { Button } from "@/components/ui/button";

import Logo from "/assets/logo.svg";

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

const excludedPatterns = [
  /^\/connexion$/,
  /^\/se-connecter$/,
  /^\/s-inscrire$/,
];

export default function Header() {
  const [isOpen, setOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const { url } = usePage();
  const isExcluded = excludedPatterns.some((pattern) => pattern.test(url));

  const user = usePage().props.currentUser;
  const sessionId = usePage().props.sessionId;

  const handleLinkClick = () => {
    setOpen(false);
  };

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logOut = () => {
    router.delete(`/sessions/${sessionId}`);
  };

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
            <NavigationMenuItem
              className={
                "py-2 px-4 rounded-md" +
                (url === "/inertia-example"
                  ? " bg-secondary"
                  : " hover:bg-secondary/50")
              }
            >
              <NavigationMenuLink asChild>
                <Link
                  href="/inertia-example"
                  className="flex gap-2 items-center"
                  onClick={handleLinkClick}
                >
                  <Search className="w-4 h-4 text-foreground" />
                  Trouver une association
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {!!user && (
              <NavigationMenuItem
                className={
                  "py-2 px-4 rounded-md" +
                  (url === "/mes-contributions"
                    ? " bg-secondary"
                    : " hover:bg-secondary/50")
                }
              >
                <NavigationMenuLink asChild>
                  <Link
                    href="/mes-contributions"
                    className="flex gap-2 items-center"
                    onClick={handleLinkClick}
                  >
                    <HandHeart className="w-4 h-4 text-foreground" />
                    Mes contributions
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {!user && (
              <NavigationMenuItem
                className={
                  "py-2 px-4 rounded-md" +
                  (url === "/qui-nous-sommes"
                    ? " bg-secondary"
                    : " hover:bg-secondary/50")
                }
              >
                <NavigationMenuLink asChild>
                  <Link
                    href="/qui-nous-sommes"
                    className="flex gap-2 items-center"
                    onClick={handleLinkClick}
                  >
                    <HandMetal className="w-4 h-4 text-foreground" />
                    Qui sommes-nous ?
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem className="py-2 px-4 rounded-md hover:bg-secondary/50 focus-visible:bg-secondary">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex gap-2 items-center outline-none">
                  <CirclePlus className="w-4 h-4 text-foreground" />
                  Plus
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-4 flex flex-col gap-2">
                  {!!user && (
                    <DropdownMenuItem
                      className={
                        "text-base py-2 px-4 rounded-md" +
                        (url === "/qui-nous-sommes"
                          ? " bg-secondary focus:bg-secondary"
                          : " hover:bg-secondary/50 focus:bg-secondary/50")
                      }
                    >
                      <NavigationMenuLink asChild>
                        <Link
                          href="/qui-nous-sommes"
                          className="flex gap-2 items-center"
                          onClick={handleLinkClick}
                        >
                          <HandMetal className="w-4 h-4 text-foreground" />
                          Qui sommes-nous ?
                        </Link>
                      </NavigationMenuLink>
                    </DropdownMenuItem>
                  )}
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
            {!user && !isExcluded && (
              <Link href="/connexion" onClick={handleLinkClick}>
                <Button>
                  <LogIn />
                  Se connecter
                </Button>
              </Link>
            )}
            {!!user && (
              <Button variant="secondary" onClick={logOut}>
                <LogOut className="text-foreground" />
                Se déconnecter
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown inside the header */}
      <div
        id="mobileDropdown"
        className={`min-[1100px]:hidden transition-all duration-700 ease-in-out overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"
          } w-max mx-auto`}
      >
        <ul className="flex flex-col mt-4">
          <li>
            <Link
              href="/inertia-example"
              className={
                "flex items-center justify-center gap-2 px-4 py-2 mb-2 rounded-md" +
                (url === "/inertia-example"
                  ? " bg-secondary"
                  : " hover:bg-secondary/50")
              }
              onClick={handleLinkClick}
            >
              <Search className="w-4 h-4 text-foreground" />
              Trouver une association
            </Link>
          </li>
          <li>
            <Link
              href="/qui-nous-sommes"
              className={
                "flex items-center justify-center gap-2 px-4 py-2 mb-2 rounded-md" +
                (url === "/qui-nous-sommes"
                  ? " bg-secondary"
                  : " hover:bg-secondary/50")
              }
              onClick={handleLinkClick}
            >
              <HandMetal className="w-4 h-4 text-foreground" />
              Qui sommes-nous ?
            </Link>
          </li>
          {!!user && (
            <li>
              <Link
                href="/mes-contributions"
                className={
                  "flex items-center justify-center gap-2 px-4 py-2 mb-2 rounded-md" +
                  (url === "/inertia-example"
                    ? " bg-secondary"
                    : " hover:bg-secondary/50")
                }
                onClick={handleLinkClick}
              >
                <HandHeart className="w-4 h-4 text-foreground" />
                Mes contributions
              </Link>
            </li>
          )}
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
          {!user && !isExcluded && (
            <>
              <hr className="border-t border-gray-300 my-2" />
              <li className="sm:hidden flex justify-center">
                <div className="py-4 flex sm:hidden">
                  <Link href="/connexion" onClick={handleLinkClick}>
                    <Button>
                      <LogIn />
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </li>
            </>
          )}
          {!!user && (
            <>
              <hr className="border-t border-gray-300 my-2" />
              <li className="sm:hidden flex justify-center">
                <div className="py-4 flex sm:hidden">
                  <Button variant="secondary" onClick={logOut}>
                    <LogOut className="text-foreground" />
                    Se déconnecter
                  </Button>
                </div>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
