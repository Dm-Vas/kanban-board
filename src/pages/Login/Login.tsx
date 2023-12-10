import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Paper, TextField, Toolbar, Typography, Link as MuiLink, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DevTool } from "@hookform/devtools";

import { useLoginMutation } from "src/api/authApi";
import { useAppDispatch, useAppSelector } from "src/store";
import { showAlert } from "src/features/alert/alertSlice";
import { selectAuth, login } from "src/features/auth/authSlice";
import { loginFormValidationSchema } from "src/utils/validationSchemas";
import { LoginFormValues } from "src/models/forms";
import { ThemeToggler } from "src/components/ThemeToggler/ThemeToggler";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { jwt } = useAppSelector(selectAuth);
  const [loginMutation, loginMutationDetails] = useLoginMutation();
  const { handleSubmit, register, formState, control } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormValidationSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogIn = handleSubmit((data) => {
    loginMutation(data)
      .unwrap()
      .then((res) => {
        dispatch(
          login({
            id: res.data.id,
            userName: res.data.userName,
            roles: res.data.roles,
            email: res.data.email,
            jwt: res.data.jwToken,
          })
        );

        navigate("/dashboard/boards");
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
              Login
            </Typography>
          </Toolbar>

          <Stack component="form" direction="column" onSubmit={handleLogIn} noValidate>
            <Stack direction="column" spacing={2} mb={3}>
              <TextField
                label="Email"
                type="email"
                error={!!formState.errors.email}
                helperText={formState.errors.email?.message}
                {...register("email")}
              />

              <TextField
                label="Password"
                type="password"
                error={!!formState.errors.password}
                helperText={formState.errors.password?.message}
                {...register("password")}
              />
            </Stack>

            <Stack direction="column" spacing={2}>
              <LoadingButton
                type="submit"
                loading={formState.isSubmitting || loginMutationDetails.isLoading}
                loadingIndicator="Logging In..."
                variant="contained"
              >
                Log In
              </LoadingButton>

              <Typography variant="caption" align="center">
                Don't have an account?{" "}
                <MuiLink component={Link} to="/register" underline="hover">
                  Register
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
