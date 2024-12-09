import { Head, useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StepForward, AlertCircle } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import QuoteSection from "@/components/reusable/QuoteSection";

export default function SignUp() {
  const [countdown, setCountdown] = useState(60);
  const { data, setData, post, processing, errors } = useForm({
    email: sessionStorage.getItem("email"),
    code: "",
  });

  useEffect(() => {
    if (!data.email) {
      router.get("/connexion");
    }
  }, [data.email]);

  useEffect(() => {
    if (
      errors.code?.includes("Votre code de connexion a expiré. Demandez-en un nouveau.")
    ) {
      setCountdown(0);
    }
  }, [errors.code]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  function resendCode() {
    post("/otp", {
      onSuccess: (page) => {
        if (page.url === "/se-connecter") {
          setData("code", "");
          setCountdown(60);
          toast.success(`Un nouveau code a été envoyé à ${data.email}`);
        }
      },
    });
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post("/sessions");
  }

  return (
    <>
      <Head>
        <title>S'inscrire</title>
        <meta name="description" content="Your page description" />
      </Head>
      <div className="flex mx-auto justify-center py-16 lg:px-16 overflow-x-hidden">
        <div className="bg-white py-8 px-4 sm:px-8 md:p-16 rounded-2xl flex flex-col max-w-[653px]">
          <h1 className="text-2xl sm:text-3xl font-semibold ">
            Connectez-vous !
          </h1>
          <div className="flex flex-col gap-4 mt-8 ">
            <p>
              Une fois que vous aurez saisi le code que nous avons envoyé à{" "}
              {data.email}, vous serez connecté.
            </p>
            <p>Il est valide durant 10 minutes.</p>
          </div>
          <form onSubmit={submit} className="flex flex-col pt-4 mt-8 gap-8">
            <div className="flex flex-col mx-auto">
              <InputOTP
                autoFocus
                id="OTP" // capybara needs an id to find the input
                required
                maxLength={6}
                value={data.code}
                onChange={(value) => {
                  setData("code", value);
                  errors.code = "";
                }}
                pattern={REGEXP_ONLY_DIGITS}
                containerClassName="mx-auto"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {errors.code && (
                <div className="flex items-center text-red-600 text-sm p-1 mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.code}
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={processing || data.code.length !== 6 || !!errors.code}
            >
              <StepForward />
              Continuer
            </Button>
          </form>
          {countdown > 0 && (
            <p className="text-sm text-muted-foreground mt-16">
              Vous n'avez pas reçu le code ?{" "}
              <span className="underline cursor-pointer">
                Renvoyer dans {countdown} secondes
              </span>
            </p>
          )}
          {countdown === 0 && (
            <p className="text-sm text-muted-foreground mt-16">
              <button
                onClick={resendCode}
                className="underline hover:text-primary"
              >
                Renvoyer un nouveau code
              </button>
            </p>
          )}
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
