import { Head } from "@inertiajs/react";
import { ConnectionForm } from './ConnectionForm';
import QuoteSection from "@/components/reusable/QuoteSection";
// @ts-ignore
import Superwoman from "/assets/images/auth/superwoman.svg?react";

export default function Connection() {
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
          <ConnectionForm/>
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
