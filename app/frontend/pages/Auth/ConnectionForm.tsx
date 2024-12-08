import { useConnectionForm } from '@/hooks/useConnectionForm';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputError } from "@/components/InputError";
import { StepForward } from "lucide-react";

export function ConnectionForm() {
  const { data, errors, processing, updateEmail, validateAndSubmit } = useConnectionForm();

  return (
    <form onSubmit={(e) => validateAndSubmit(e)} className="w-full flex flex-col pt-4 gap-8" aria-label="form">
      <div>
        <Input
          type="email"
          required
          autoFocus
          title="Votre adresse email"
          placeholder="Votre adresse email"
          value={data.email}
          onChange={(e) => updateEmail(e.target.value)}
          className={
            "bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0" +
            (errors.email ? " border-red-600" : "")
          }
        />
        {errors.email && <InputError>{errors.email}</InputError>}
      </div>
      <Button type="submit" disabled={processing || errors.email}>
        <StepForward />
        Continuer
      </Button>
    </form>
  );
}
