import { Head, Link, useForm } from "@inertiajs/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StepForward, AlertCircle } from "lucide-react";

import QuoteSection from "@/components/reusable/QuoteSection";
// @ts-ignore
import Vomi from "/assets/images/auth/vomi.svg?react";

export default function SignUp() {
  const { data, setData, post, processing, errors } = useForm({
    code: "",
  });
  const email = sessionStorage.getItem("email");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post("/se-connecter");
  }

  return (
    <>
      <Head>
        <title>S'inscrire</title>
        <meta name="description" content="Your page description" />
      </Head>
      <div className="flex mx-auto justify-center py-16 lg:px-16">
        <div className="bg-white p-8 md:p-16 rounded-2xl flex flex-col gap-8 max-w-[702px]">
          <h1 className="text-2xl sm:text-3xl font-semibold ">
            Connectez-vous !
          </h1>
          <div className="flex flex-col gap-2">
            <p>
              Cliquez sur le lien de connexion que nous avons envoyé à{" "}
              <span className="font-medium italic">{email}</span>.
            </p>
            <p>Il est valide durant 10 minutes.</p>
          </div>
          {/* <form onSubmit={submit} className="w-full flex flex-col pt-4 gap-8">
            <div className="flex flex-col">
              <Input
                type="text"
                required
                value={data.code}
                onChange={(e) => {
                  setData("code", e.target.value);
                  errors.code = "";
                }}
                placeholder="Code reçu par email"
                className={`bg-white mt-4 focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 ${
                  errors.code ? "border-red-600" : ""
                }`}
              />
              {errors.code && (
                <div className="flex items-center text-red-600 text-sm rounded-md p-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.code}
                </div>
              )}
            </div>
            <Button type="submit" disabled={processing}>
              <StepForward />
              Continuer
            </Button>
          </form> */}
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas reçu l'email ?{" "}
            <Link href="" className="underline hover:text-primary">
              Renvoyer dans 30 secondes
            </Link>
          </p>
        </div>
      </div>
      <QuoteSection
        quote={
          <span>
            Tout est question d'espoir, de gentillesse et de connexion les uns
            avec les autres.
          </span>
        }
        author={<span>Elizabeth Taylor</span>}
      />
    </>
  );
}
