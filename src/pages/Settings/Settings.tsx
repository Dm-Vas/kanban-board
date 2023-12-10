import { Box, Paper, Stack, Typography } from "@mui/material";
import { selectAuth } from "src/features/auth/authSlice";
import { useAppSelector } from "src/store";

export const Settings = () => {
  const { id, userName, email, roles } = useAppSelector(selectAuth);

  return (
    <Box sx={{ height: "100%" }}>
      <Paper sx={{ p: 5, height: "100%", borderRadius: "30px" }}>
        <Typography variant="h4" marginBottom={3}>
          User Settings
        </Typography>

        <Stack gap={1}>
          <Typography variant="body1">
            <strong>ID:</strong> {id}
          </Typography>

          <Typography variant="body1">
            <strong>Username:</strong> {userName}
          </Typography>

          <Typography variant="body1">
            <strong>Email:</strong> {email}
          </Typography>

          <Typography variant="body1">
            <strong>Roles:</strong> {roles?.join(", ")}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};
