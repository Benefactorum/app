import { Head, Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import { StepForward } from "lucide-react";

import QuoteSection from "@/components/reusable/QuoteSection";
// @ts-ignore
import Vomi from "/assets/images/auth/vomi.svg?react";

export default function SignUp({ email }: { email: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: email,
    first_name: "",
    last_name: "",
    accepts_conditions: false,
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post("/s-inscrire");
  }
  // function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   const form = e.target as HTMLFormElement;
  //   const inputValue = (form.elements[0] as HTMLInputElement).value.trim();

  //   // if (!inputValue) {
  //   //   return;
  //   // }
  //   // router.post("/user/create_or_find", { email: inputValue });
  // }

  return (
    <>
      <Head>
        <title>S'inscrire</title>
        <meta name="description" content="Your page description" />
      </Head>
      <div className="flex mx-auto justify-center py-16 lg:px-16">
        <div className="bg-white p-8 md:p-16 rounded-2xl flex flex-col gap-8 max-w-[702px]">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Créez votre compte !
          </h1>
          <p className="flex flex-col">
            Vous êtes en train de créer un compte sur Benefactorum avec
            l'adresse <span className="font-medium italic">{email}</span>
          </p>
          <form onSubmit={submit} className="w-full flex flex-col pt-4 gap-8">
            <div className="flex flex-col gap-4">
              <Label htmlFor="firstName">Prénom :</Label>
              <Input
                id="firstName"
                type="text"
                value={data.first_name}
                onChange={(e) => setData("first_name", e.target.value)}
                required
                title="Votre prénom"
                placeholder="Alain"
                className="bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="lastName">Nom :</Label>
              <Input
                id="lastName"
                type="text"
                value={data.last_name}
                onChange={(e) => setData("last_name", e.target.value)}
                required
                title="Votre nom"
                placeholder="Connu"
                className="bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Checkbox
                id="terms"
                checked={data.accepts_conditions}
                onCheckedChange={(checked) => {
                  setData("accepts_conditions", !!checked);
                }}
              />
              <Label htmlFor="terms" className="leading-normal font-normal">
                Je confirme avoir lu et accepté les{" "}
                <Link
                  href="/mentions-legales"
                  target="_blank"
                  className="underline hover:text-primary"
                >
                  Termes et Conditions
                </Link>{" "}
                et la{" "}
                <Link
                  href="/donnees-personnelles"
                  target="_blank"
                  className="underline hover:text-primary"
                >
                  Politique de Confidentialité
                </Link>{" "}
                de Benefactorum.
              </Label>
            </div>
            <Button variant="secondary" type="submit" disabled={processing}>
              <StepForward />
              Continuer
            </Button>
          </form>
        </div>
      </div>
      <QuoteSection
        quote={<span>Avec Benefactorum, je suis hyper content !</span>}
        author={
          <span>
            Simon Jérémi (
            <a
              href="https://www.youtube.com/watch?v=sjErA1fL5JU"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              La cité de la peur
            </a>
            )
            <Vomi className="inline-block ml-2 w-6 h-6" />
          </span>
        }
      />
    </>
  );
}
