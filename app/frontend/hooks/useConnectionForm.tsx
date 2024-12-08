import { useForm } from "@inertiajs/react";
import { z } from 'zod';

const emailSchema = z.string().email({ message: "Veuillez entrer une adresse email valide." });

export function useConnectionForm() {
  const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
    email: sessionStorage.getItem("email") || "",
  });

  function validateAndSubmit() {
    const validation = emailSchema.safeParse(data.email);
    if (!validation.success) {
      setError("email", validation.error.errors[0].message);
      return;
    }

    post("/connections", {
      onSuccess: (page) => {
        if (page.url !== "/connexion") {
          sessionStorage.setItem("email", data.email);
          // TODO: try to instruct inertia to store form's data and errors in history state instead of using sessionStorage
          sessionStorage.removeItem("firstName");
          sessionStorage.removeItem("lastName");
          sessionStorage.removeItem("signUpBlocked");
          sessionStorage.removeItem("acceptsConditions");
        }
      },
    });
  }

  function updateEmail(value) {
    setData("email", value);
    clearErrors("email");
  }

  return {
    data,
    errors,
    processing,
    updateEmail,
    validateAndSubmit,
  };
}
