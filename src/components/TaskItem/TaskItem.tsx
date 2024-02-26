import { Avatar, Box, Paper, Typography } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/query";
import { grey } from "@mui/material/colors";

import { selectThemeMode } from "src/features/themeMode/themeModeSlice";
import { formatDateOfCreation } from "src/utils/formatDateOfCreation";
import { getUserInitials } from "src/utils/getUserInitials";
import { useGetUserDetailsQuery } from "src/api/userApi";
import { useAppSelector } from "src/store";

import type { TaskItemProps } from "./TaskItem.types";

export const TaskItem = ({ title, userAttached, isDragging, dateOfCreation }: TaskItemProps) => {
  const { mode } = useAppSelector(selectThemeMode);
  const { data: user } = useGetUserDetailsQuery(userAttached || skipToken);

  const bgcolor = mode === "dark" ? grey[900] : grey[50];

  return (
    <Paper
      component="li"
      elevation={2}
      sx={{
        minHeight: "150px",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        bgcolor: isDragging ? bgcolor : undefined,
      }}
    >
      <Typography component="h3" noWrap>
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "auto",
        }}
      >
        {user && userAttached && (
          <Avatar
            alt="User Avatar"
            sx={{
              width: 30,
              height: 30,
              fontSize: 12,
              alignSelf: "flex-end",
            }}
          >
            {getUserInitials(user)}
          </Avatar>
        )}

        <Typography variant="caption">Created: {formatDateOfCreation(dateOfCreation)}</Typography>
      </Box>
    </Paper>
  );
};
