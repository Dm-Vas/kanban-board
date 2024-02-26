import { Link, Navigate, useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Toolbar, Typography, Link as MuiLink, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useRegisterMutation } from "src/api/authApi";
import { selectAuth } from "src/features/auth/authSlice";
import { showAlert } from "src/features/alert/alertSlice";
import { useAppDispatch, useAppSelector } from "src/store";
import { useRegisterForm } from "src/hooks/useRegisterForm";
import { ThemeToggler } from "src/components/ThemeToggler/ThemeToggler";

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { jwt } = useAppSelector(selectAuth);
  const [registerMutation, registerMutationDetails] = useRegisterMutation();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useRegisterForm();

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
            Register
          </Typography>
        </Toolbar>

        <Stack component="form" noValidate onSubmit={handleRegister} width="100%" direction="column">
          <Stack direction="column" spacing={2} mb={3}>
            <Stack direction="row" spacing={2}>
              <TextField
                {...register("firstName")}
                label="First Name"
                type="text"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />

              <TextField
                {...register("lastName")}
                label="Last Name"
                type="text"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Stack>

            <TextField
              {...register("userName")}
              label="Username"
              type="text"
              error={!!errors.userName}
              helperText={errors.userName?.message}
            />

            <TextField
              {...register("email")}
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              {...register("password")}
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              {...register("confirmPassword")}
              label="Confirm Password"
              type="password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Stack>

          <Stack direction="column" spacing={2}>
            <LoadingButton
              type="submit"
              variant="contained"
              loadingIndicator="Registering..."
              loading={registerMutationDetails.isLoading}
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
  );
};
