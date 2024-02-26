import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { SingleInputFormValues } from "src/models/forms";
import { singleInputFormValidationSchema } from "src/utils/validationSchemas";

export const useSingleInputForm = (message: string) => {
  return useForm<SingleInputFormValues>({
    resolver: zodResolver(singleInputFormValidationSchema(message)),
    defaultValues: {
      name: "",
    },
  });
};
