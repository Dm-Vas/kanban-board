import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { RegisterFormValues } from "src/models/forms";
import { registerFormValidationSchema } from "src/utils/validationSchemas";

export const useRegisterForm = () => {
  return useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
};
