import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StepForward, AlertCircle } from "lucide-react";

export function ConnectionForm({ email, errors, processing, onEmailChange, onSubmit }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col pt-4 gap-8">
      <div>
        <Input
          type="email"
          required
          autoFocus
          title="Votre adresse email"
          placeholder="Votre adresse email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
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
      <Button type="submit" disabled={processing || errors.email}>
        <StepForward />
        Continuer
      </Button>
    </form>
  );
}
