import { z } from "zod";

import {
  firstNameValidationShape,
  lastNameValidationShape,
  usernameValidationShape,
  emailValidationShape,
  passwordValidationShape,
  confirmPasswordValidationShape,
  taskTitleValidationShape,
  taskDescriptionValidationShape,
  taskStatusValidationShape,
  taskAssigneeValidationShape,
  singleInputValidationShape,
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

export const singleInputFormValidationSchema = (message: string) =>
  z.object({
    name: singleInputValidationShape(message),
  });

export const taskFormValidationSchema = z.object({
  title: taskTitleValidationShape,
  column: taskStatusValidationShape,
  assignee: taskAssigneeValidationShape,
  description: taskDescriptionValidationShape,
});
