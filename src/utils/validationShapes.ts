import { z } from "zod";

export const emailValidationShape = z
  .string()
  .min(1, {
    message: "Email field cannot be empty",
  })
  .email();

export const passwordValidationShape = z
  .string()
  .min(1, {
    message: "Password field cannot be empty",
  })
  .length(6, { message: "Password must be at least 6 characters long" });

export const confirmPasswordValidationShape = z.string().min(1, {
  message: "Confirm password field cannot be empty",
});

export const firstNameValidationShape = z.string().min(1, {
  message: "First name field cannot be empty",
});

export const lastNameValidationShape = z.string().min(1, {
  message: "Last name field cannot be empty",
});

export const usernameValidationShape = z
  .string()
  .min(1, {
    message: "Username field cannot be empty",
  })
  .length(6, {
    message: "Username must be at least 6 characters long",
  });

export const taskTitleValidationShape = z.string().min(1, { message: "Task title cannot be empty" });

export const taskDescriptionValidationShape = z.string().min(1, { message: "Task description cannot be empty" });

export const taskStatusValidationShape = z.string();

export const taskAssigneeValidationShape = z.string().optional();

export const singleInputValidationShape = (message: string) => z.string().min(1, { message });
