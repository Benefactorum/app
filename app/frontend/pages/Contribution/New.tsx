import { Head, useForm } from '@inertiajs/react'
import { OsblFormType } from './types'
import { CurrentUserType } from '@/pages/types'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"

import { AlertCircle, Save } from "lucide-react";
import GoodIdea from "/assets/icons/good-idea.svg?react";


interface NewProps {
  currentUser: CurrentUserType
  osbl: OsblType
}

export default function New({ currentUser, Osbl }: NewProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    website: "",
    logo: null,
    description: "",
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post(`/users/${currentUser.id}/contributions`);
  }

  return (
    <>
      <Head title="Ajouter une association" />

      <div className="2xl:container mx-auto flex flex-col px-2 sm:px-8 md:px-16 pt-8 pb-16 gap-8">
        <h1 className="font-semibold text-3xl">Ajouter une association</h1>
        <Alert>
          <GoodIdea className="min-w-8 min-h-8" />
          <AlertDescription>
            Pour que votre contribution soit validée, le modérateur doit pouvoir vérifier les informations fournies. Facilitez son travail en indiquant clairement vos sources !
          </AlertDescription>
        </Alert>

        <form onSubmit={submit} className="flex flex-col pt-4 gap-16">
          <Button type="submit" disabled={processing} className='mx-auto'>
            <Save />
            Enregistrer
          </Button>
          <div className='flex flex-wrap gap-16 mx-auto justify-center'>
            <div className='bg-white w-full sm:w-auto rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col'>
              <h2 className="text-2xl font-semibold">En-tête</h2>
              <div className='flex flex-col gap-8'>
                <div>
                  <div className="flex gap-x-8 gap-y-2 items-center flex-wrap justify-between">
                    <Label htmlFor="name" className=''>Nom de l’association* :</Label>
                    <Input
                      type="text"
                      id="name"
                      required
                      value={data.name}
                      onChange={(e) => {
                        setData("name", e.target.value);
                        errors.name = "";
                      }}
                      className={
                        "bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-auto flex-grow" +
                        (errors.name ? " border-red-600" : "")
                      }
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center text-red-600 text-sm p-1 justify-end">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex gap-x-8 gap-y-2 items-center flex-wrap">
                    <Label htmlFor="website" className=''>Site internet :</Label>
                    <Input
                      type="text"
                      id="website"
                      value={data.website}
                      onChange={(e) => {
                        setData("website", e.target.value);
                        errors.website = "";
                      }}
                      className={
                        "bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-auto flex-grow" +
                        (errors.website ? " border-red-600" : "")
                      }
                    />
                  </div>
                  {errors.website && (
                    <div className="flex items-center text-red-600 text-sm p-1 justify-end">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.website}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex gap-x-24 gap-y-2 items-center flex-wrap">
                    <Label htmlFor="logo" className='flex-grow'>Logo :</Label>
                    <Input
                      type="file"
                      id="logo"
                      className="bg-secondary focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-auto flex-grow"
                      onChange={(e) => {
                        setData("logo", e.target.files[0]);
                        errors.logo = null;
                      }} />
                  </div>
                  {errors.logo && (
                    <div className="flex items-center text-red-600 text-sm p-1 justify-end">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.logo}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="description" className=''>Description de l'association:</Label>
                    <Textarea
                      id="description"
                      placeholder='300 caractères maximum.'
                      value={data.description}
                      onChange={(e) => {
                        setData("description", e.target.value);
                        errors.description = "";
                      }}
                      className={
                        "bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-auto flex-grow h-40" +
                        (errors.description ? " border-red-600" : "")
                      } />
                  </div>
                  {errors.description && (
                    <div className="flex items-center text-red-600 text-sm p-1 justify-end">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={processing} className='mx-auto'>
            <Save />
            Enregistrer
          </Button>
        </form>
      </div>
    </>
  )
}
