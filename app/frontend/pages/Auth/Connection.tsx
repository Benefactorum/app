import { Head } from "@inertiajs/react";

import { StepForward } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QuoteSection from "@/components/reusable/QuoteSection";
// @ts-ignore
import Superwoman from "/assets/images/auth/superwoman.svg?react";

import { router } from "@inertiajs/react";

export default function Connection() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputValue = (form.elements[0] as HTMLInputElement).value.trim();

    if (!inputValue) {
      return;
    }
    router.post("/user/create_or_find", { email: inputValue });
  }

  return (
    <>
      <Head>
        <title>Se connecter</title>
        <meta name="description" content="Your page description" />
      </Head>
      <div className="flex mx-auto justify-center py-16 lg:px-16">
        <div className="bg-white p-8 md:p-16 rounded-2xl flex flex-col gap-8">
          <h1 className="text-2xl sm:text-3xl font-semibold">Bonjour !</h1>
          <p className="flex flex-col gap-8">
            Connectez-vous ou inscrivez-vous en quelques secondes !
            <span className="whitespace-pre-line">
              Nous allons vérifier si vous avez un compte.{"\n"}
              Nous vous aiderons à en créer un si ce n'est pas le cas.
            </span>
          </p>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col pt-4 gap-8"
          >
            <Input
              type="email"
              required
              title="Votre adresse email"
              placeholder="Votre adresse email"
              className="bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0"
            />
            <Button type="submit">
              <StepForward />
              Continuer
            </Button>
          </form>
        </div>
      </div>
      <QuoteSection
        quote={<span>Sur Benefactorum, je peux enfin tomber le masque !</span>}
        author={
          <span>
            Superwoman
            <Superwoman className="inline-block ml-2 w-6 h-6 mb-2" />
          </span>
        }
      />
    </>
  );
}
