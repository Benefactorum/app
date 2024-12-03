import { Head, useForm } from '@inertiajs/react'
import { OsblFormType } from './types'
import { CurrentUserType } from '@/pages/types'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface NewProps {
  currentUser: CurrentUserType
  osbl: OsblType
}

export default function New({ currentUser, Osbl }: NewProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post(`/users/${currentUser.id}/contributions`);
  }

  return (
    <>
      <Head title="Ajouter une association" />

      <div className="mx-auto md:w-2/3 w-full px-8 pt-8">
        <h1 className="font-bold text-4xl">Ajouter une association</h1>

        <form onSubmit={submit} className="w-full flex flex-col pt-4 gap-8">
          <div>
            <Input
              type="text"
              required
              value={data.name}
              onChange={(e) => {
                setData("name", e.target.value);
                errors.name = "";
              }}
              className={
                "bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0" +
                (errors.name ? " border-red-600" : "")
              }
            />
            {errors.email && (
              <div className="flex items-center text-red-600 text-sm rounded-md p-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </div>
            )}
          </div>
          <Button type="submit" disabled={processing}>
            Enregistrer
          </Button>
        </form>
      </div>
    </>
  )
}
