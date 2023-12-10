import { z } from "zod";

import {
  loginFormValidationSchema,
  registerFormValidationSchema,
  singleInputFormValidationSchema,
  createBoardFormValidationSchema,
  taskFormValidationSchema,
  editTaskFormValidationSchema,
} from "src/utils/validationSchemas";

export type LoginFormValues = z.infer<typeof loginFormValidationSchema>;

export type RegisterFormValues = z.infer<typeof registerFormValidationSchema>;

export type SingleInputFormValues = z.infer<typeof singleInputFormValidationSchema>;

export type CreateBoardFormValues = z.infer<typeof createBoardFormValidationSchema>;

export type TaskFormValues = z.infer<typeof taskFormValidationSchema>;

export type EditTaskFormValues = z.infer<typeof editTaskFormValidationSchema>;
