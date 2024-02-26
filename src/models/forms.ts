import { z } from "zod";

import {
  taskFormValidationSchema,
  loginFormValidationSchema,
  registerFormValidationSchema,
  singleInputFormValidationSchema,
} from "src/utils/validationSchemas";

export type LoginFormValues = z.infer<typeof loginFormValidationSchema>;

export type RegisterFormValues = z.infer<typeof registerFormValidationSchema>;

export type TaskFormValues = z.infer<typeof taskFormValidationSchema>;

export type SingleInputFormValues = z.infer<ReturnType<typeof singleInputFormValidationSchema>>;
