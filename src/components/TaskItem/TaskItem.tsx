import { Avatar, AvatarGroup, Paper, Typography } from "@mui/material";

import { formatDateOfCreation } from "src/utils/formatDateOfCreation";

import { TaskItemProps } from "./TaskItem.types";

export const TaskItem = ({ title, isDragging, dateOfCreation }: TaskItemProps) => {
  return (
    <Paper
      component="li"
      elevation={2}
      sx={{
        bgcolor: isDragging ? "red" : undefined,
        minHeight: "150px",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
      }}
    >
      <Typography component="h3">{title}</Typography>

      <AvatarGroup
        max={3}
        sx={{
          "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 12 },
        }}
      >
        <Avatar alt="R S" src="" />
        <Avatar alt="W A" src="" />
        <Avatar alt="W S" src="" />
        <Avatar alt="R N" src="" />
        <Avatar alt="F E" src="" />
      </AvatarGroup>

      <Typography variant="caption" mt="auto">
        Created: {formatDateOfCreation(dateOfCreation)}
      </Typography>
    </Paper>
  );
};
