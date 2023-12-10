import { z } from "zod";

export const emailValidationShape = z
  .string()
  .nonempty({
    message: "Email field cannot be empty",
  })
  .email();

export const passwordValidationShape = z
  .string()
  .nonempty({
    message: "Password field cannot be empty",
  })
  .min(6, {
    message: "Password must be at least 6 characters long",
  });

export const confirmPasswordValidationShape = z.string().nonempty({
  message: "Confirm password field cannot be empty",
});

export const firstNameValidationShape = z.string().nonempty({
  message: "First name field cannot be empty",
});

export const lastNameValidationShape = z.string().nonempty({
  message: "Last name field cannot be empty",
});

export const usernameValidationShape = z
  .string()
  .nonempty({
    message: "Username field cannot be empty",
  })
  .min(6, {
    message: "Username must be at least 6 characters long",
  });

export const boardNameValidationShape = z.string().nonempty({
  message: "Column name field cannot be empty",
});

export const columnNameValidationShape = z.string().nonempty({
  message: "Column name field cannot be empty",
});

export const columnValidationShape = z.array(
  z.object({
    name: columnNameValidationShape,
  })
);

export const taskTitleValidationShape = z.string().nonempty({
  message: "Task title cannot be empty",
});

export const taskDescriptionValidationShape = z.string().nonempty({
  message: "Task description cannot be empty",
});

export const taskStatusValidationShape = z.string();
