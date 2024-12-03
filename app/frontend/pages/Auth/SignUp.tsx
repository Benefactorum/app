import { Head, Link, useForm, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { StepForward, AlertCircle } from "lucide-react";
import ReCAPTCHA from 'react-google-recaptcha';
import QuoteSection from "@/components/reusable/QuoteSection";
// @ts-ignore
import Vomi from "/assets/images/auth/vomi.svg?react";

export default function SignUp() {
  const { data, setData, post, processing, errors } = useForm({
    email: sessionStorage.getItem("email"),
    first_name: sessionStorage.getItem("firstName") || "",
    last_name: sessionStorage.getItem("lastName") || "",
    accepts_conditions: !!sessionStorage.getItem("acceptsConditions") || false,
    terms_and_privacy_accepted_at: "",
    recaptcha_token: "",
  });
  const signUpBlocked = !!sessionStorage.getItem("signUpBlocked") || false;
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (!data.email) {
      router.get("/connexion");
    }
  }, [data.email]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = recaptchaRef.current ? await recaptchaRef.current.executeAsync() : "";
    data.recaptcha_token = token || "";
    post("registrations", {
      onSuccess: (page) => {
        if (page.url === "/se-connecter") {
          sessionStorage.setItem("firstName", data.first_name);
          sessionStorage.setItem("lastName", data.last_name);
          sessionStorage.setItem("signUpBlocked", "true");
          sessionStorage.setItem("acceptsConditions", "true");
        }
      }
    });
  }

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
            l'adresse <span className="font-medium italic">{data.email}</span>
          </p>
          <form onSubmit={submit} className="w-full flex flex-col pt-4 gap-8">
            <div className="flex flex-col">
              <Label htmlFor="firstName">Prénom :</Label>
              <Input
                id="firstName"
                type="text"
                required
                disabled={signUpBlocked === true}
                value={data.first_name}
                onChange={(e) => {
                  setData("first_name", e.target.value);
                  errors.first_name = "";
                }}
                placeholder="Alain"
                className={`bg-white mt-4 focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 ${errors.first_name ? "border-red-600" : ""}`}
              />
              {errors.first_name && (
                <div className="flex items-center text-red-600 text-sm p-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.first_name}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="lastName">Nom :</Label>
              <Input
                id="lastName"
                type="text"
                required
                disabled={signUpBlocked === true}
                value={data.last_name}
                onChange={(e) => {
                  setData("last_name", e.target.value);
                  errors.last_name = "";
                }}
                placeholder="Connu"
                className={`bg-white mt-4 focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 ${errors.last_name ? "border-red-600" : ""}`}
              />
              {errors.last_name && (
                <div className="flex items-center text-red-600 text-sm p-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.last_name}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-4">
                <Checkbox
                  id="terms"
                  required
                  disabled={signUpBlocked === true}
                  checked={data.accepts_conditions}
                  onCheckedChange={(checked) => {
                    setData("accepts_conditions", !!checked);
                    errors.terms_and_privacy_accepted_at = "";
                  }}
                  className={`${errors.terms_and_privacy_accepted_at ? "border-red-600" : ""}`}
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
              {errors.terms_and_privacy_accepted_at && (
                <div className="flex items-center text-red-600 text-sm p-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.terms_and_privacy_accepted_at}
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LfkEYUqAAAAAOacT9yEDlhWHnXbaZ5IJhVFbXIf"
                size="invisible"
              />
            </div>
            <Button
              variant="secondary"
              type="submit"
              disabled={signUpBlocked === true || processing}
            >
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
