import { z } from "zod";

import {
  firstNameValidationShape,
  lastNameValidationShape,
  usernameValidationShape,
  emailValidationShape,
  passwordValidationShape,
  confirmPasswordValidationShape,
  boardNameValidationShape,
  columnValidationShape,
  taskTitleValidationShape,
  taskDescriptionValidationShape,
  taskStatusValidationShape,
} from "./validationShapes";

export const registerFormValidationSchema = z
  .object({
    firstName: firstNameValidationShape,
    lastName: lastNameValidationShape,
    userName: usernameValidationShape,
    email: emailValidationShape,
    password: passwordValidationShape,
    confirmPassword: confirmPasswordValidationShape,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginFormValidationSchema = z.object({
  email: emailValidationShape,
  password: passwordValidationShape,
});

export const singleInputFormValidationSchema = z.object({
  name: boardNameValidationShape,
});

export const createBoardFormValidationSchema = z.object({
  name: boardNameValidationShape,
  columns: columnValidationShape,
});

export const taskFormValidationSchema = z.object({
  title: taskTitleValidationShape,
  description: taskDescriptionValidationShape,
});

export const editTaskFormValidationSchema = taskFormValidationSchema.extend({
  status: taskStatusValidationShape,
});
