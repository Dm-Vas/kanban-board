import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, TextField, Toolbar, Typography, Link as MuiLink, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DevTool } from "@hookform/devtools";

import { useAppDispatch, useAppSelector } from "src/store";
import { selectAuth, login } from "src/features/auth/authSlice";
import { registerFormValidationSchema } from "src/utils/validationSchemas";
import type { RegisterFormValues } from "src/models/forms";
import { useRegisterMutation } from "src/api/authApi";
import { showAlert } from "src/features/alert/alertSlice";
import { ThemeToggler } from "src/components/ThemeToggler/ThemeToggler";

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { jwt } = useAppSelector(selectAuth);
  const [registerMutation, registerMutationDetails] = useRegisterMutation();
  const { handleSubmit, register, formState, control } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { errors: formErrors, isSubmitting: isFormSubmitting } = formState;

  const handleRegister = handleSubmit((data) => {
    registerMutation(data)
      .unwrap()
      .then(() => {
        navigate("/login");
        dispatch(
          showAlert({
            severity: "success",
            message: "Account created successfully! You can now log in.",
          })
        );
      })
      .catch((err) => {
        dispatch(
          showAlert({
            severity: "error",
            message: err.data.Message,
          })
        );
      });
  });

  if (jwt) return <Navigate to="/dashboard/boards" />;

  return (
    <>
      <Box
        component="main"
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper component={Stack} gap={3} sx={{ width: "90%", maxWidth: "400px", p: 3 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
          </Toolbar>

          <Stack component="form" direction="column" onSubmit={handleRegister} noValidate>
            <Stack direction="column" spacing={2} mb={3}>
              <TextField
                label="First Name"
                type="text"
                error={!!formErrors.firstName}
                helperText={formErrors.firstName?.message}
                {...register("firstName")}
              />

              <TextField
                label="Last Name"
                type="text"
                error={!!formErrors.lastName}
                helperText={formErrors.lastName?.message}
                {...register("lastName")}
              />

              <TextField
                label="Username"
                type="text"
                error={!!formErrors.userName}
                helperText={formErrors.userName?.message}
                {...register("userName")}
              />

              <TextField
                label="Email"
                type="email"
                error={!!formErrors.email}
                helperText={formErrors.email?.message}
                {...register("email")}
              />

              <TextField
                label="Password"
                type="password"
                error={!!formErrors.password}
                helperText={formErrors.password?.message}
                {...register("password")}
              />

              <TextField
                label="Confirm Password"
                type="password"
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </Stack>

            <Stack direction="column" spacing={2}>
              <LoadingButton
                type="submit"
                loading={isFormSubmitting || registerMutationDetails.isLoading}
                loadingIndicator="Registering..."
                variant="contained"
              >
                Register
              </LoadingButton>

              <Typography variant="caption" align="center">
                Already have an account?{" "}
                <MuiLink component={Link} to="/login" underline="hover">
                  Log in
                </MuiLink>
              </Typography>
            </Stack>
          </Stack>

          <ThemeToggler />
        </Paper>
      </Box>

      <DevTool control={control} />
    </>
  );
};
