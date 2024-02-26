import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { LoginFormValues } from "src/models/forms";
import { loginFormValidationSchema } from "src/utils/validationSchemas";

export const useLoginForm = () => {
  return useForm<LoginFormValues>({
    resolver: zodResolver(loginFormValidationSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
};
