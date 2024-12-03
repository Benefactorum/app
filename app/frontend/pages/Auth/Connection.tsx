import { Head, useForm } from "@inertiajs/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StepForward, AlertCircle } from "lucide-react";

import QuoteSection from "@/components/reusable/QuoteSection";
// @ts-ignore
import Superwoman from "/assets/images/auth/superwoman.svg?react";

export default function Connection() {
  const { data, setData, post, processing, errors } = useForm({
    email: sessionStorage.getItem("email") || "",
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post("/connections", {
      onSuccess: (page) => {
        if (page.url !== "/connexion") {
          sessionStorage.setItem("email", data.email);
          sessionStorage.removeItem("firstName");
          sessionStorage.removeItem("lastName");
          sessionStorage.removeItem("signUpBlocked");
          sessionStorage.removeItem("acceptsConditions");
        }
      },
    });
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
          <form onSubmit={submit} className="w-full flex flex-col pt-4 gap-8">
            <div>
              <Input
                type="email"
                required
                title="Votre adresse email"
                placeholder="Votre adresse email"
                value={data.email}
                onChange={(e) => {
                  setData("email", e.target.value);
                  errors.email = "";
                }}
                className={
                  "bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0" +
                  (errors.email ? " border-red-600" : "")
                }
              />
              {errors.email && (
                <div className="flex items-center text-red-600 text-sm p-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>
            <Button type="submit" disabled={processing}>
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
