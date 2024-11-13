import LogInIcon from "/assets/icons/login.svg?react";
import { StepForward } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";

// import { router } from "@inertiajs/react";

export default function SignInModal() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputValue = (form.elements[0] as HTMLInputElement).value;
    alert(inputValue);
    // router.get("", inputValue.value);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="">
          <LogInIcon />
          Se connecter
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white flex flex-col w-full py-16 sm:py-16 px-2 min-[591px]:px-16 ">
        <DialogHeader>
          <DialogTitle className="text-3xl">Bonjour !</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col pt-8 gap-8">
          <p>Connectez-vous ou inscrivez-vous en quelques secondes !</p>
          <p className="whitespace-pre-line">
            Nous allons vérifier si vous avez un compte.{"\n"}
            Nous vous aiderons à en créer un si ce n'est pas le cas.
          </p>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
            <Input
              type="email"
              title="Votre adresse email"
              placeholder="Votre adresse email"
              className="bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:placeholder-transparent focus-visible:ring-offset-0"
            />
            <Button type="submit" className="">
              <StepForward />
              Continuer
            </Button>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
