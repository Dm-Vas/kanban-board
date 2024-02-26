import { Link, Navigate, useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Toolbar, Typography, Link as MuiLink, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { ThemeToggler } from "src/components/ThemeToggler/ThemeToggler";
import { selectAuth, login } from "src/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "src/store";
import { showAlert } from "src/features/alert/alertSlice";
import { useLoginForm } from "src/hooks/useLoginForm";
import { useLoginMutation } from "src/api/authApi";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { jwt } = useAppSelector(selectAuth);
  const { formState, handleSubmit, register } = useLoginForm();
  const [loginMutation, loginMutationDetails] = useLoginMutation();

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
      <Paper
        sx={{
          width: "100%",
          maxWidth: "450px",
          height: "fit-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          p: 3,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
        </Toolbar>

        <Stack component="form" noValidate onSubmit={handleLogIn} width="100%" direction="column">
          <Stack direction="column" spacing={2} mb={3}>
            <TextField
              {...register("email")}
              label="Email"
              type="email"
              error={!!formState.errors.email}
              helperText={formState.errors.email?.message}
            />

            <TextField
              {...register("password")}
              label="Password"
              type="password"
              error={!!formState.errors.password}
              helperText={formState.errors.password?.message}
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
  );
};
