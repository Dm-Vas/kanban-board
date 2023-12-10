import { useState, useId, MouseEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Paper, Box, IconButton, Link, Typography, Stack } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useAppDispatch } from "src/store";
import { formatDateOfCreation } from "src/utils/formatDateOfCreation";
import { openSingleInputForm } from "src/features/singleInputForm/singleInputFormSlice";
import { openConfirmationDialog } from "src/features/confirmationDialog/confirmationDialogSlice";
import { ActionMenu } from "src/components/ActionMenu/ActionMenu";

import { BoardItemProps } from "./BoardItem.types";

export const BoardItem = ({ id, name, totalNumberOfTasks, dateOfCreation }: BoardItemProps) => {
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(null);
  const moreMenuId = useId();
  const moreMenuButtonId = useId();
  const dispatch = useAppDispatch();

  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const handleOpenMoreMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setMoreMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMoreMenu = () => {
    setMoreMenuAnchorEl(null);
  };

  const handleEditBoard = () => {
    handleCloseMoreMenu();
    dispatch(
      openSingleInputForm({
        type: "rename-board",
        entityId: id,
        oldName: name,
      })
    );
  };

  const handleDeleteBoard = () => {
    dispatch(
      openConfirmationDialog({
        title: "Delete board?",
        content:
          "Are you sure you want to delete this board and all tasks associated with it? This action cannot be undone.",
        confirmationButtonLabel: "Delete",
        confirmationKey: "deleteBoard",
        deleteItemId: id,
      })
    );
    handleCloseMoreMenu();
  };

  return (
    <Paper
      sx={{
        width: "100%",
        height: "300px",
        borderRadius: "30px",
        position: "relative",
      }}
    >
      <IconButton
        id={moreMenuButtonId}
        aria-controls={moreMenuOpen ? moreMenuId : undefined}
        aria-haspopup="true"
        aria-expanded={moreMenuOpen ? "true" : undefined}
        onClick={handleOpenMoreMenu}
        sx={{ position: "absolute", top: "10px", right: "10px" }}
      >
        <MoreHorizIcon />
      </IconButton>
      <ActionMenu
        open={moreMenuOpen}
        id={moreMenuId}
        aria-labelledby={moreMenuButtonId}
        anchorEl={moreMenuAnchorEl}
        onClose={handleCloseMoreMenu}
        menuItems={[
          {
            icon: <EditIcon />,
            label: "Rename Board",
            onClick: handleEditBoard,
          },
          {
            icon: <DeleteIcon />,
            label: "Delete Board",
            onClick: handleDeleteBoard,
          },
        ]}
      />
      <Link
        component={RouterLink}
        to={`/dashboard/boards/${id}`}
        sx={{
          color: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "50px 25px 25px",
          textDecoration: "none",
        }}
      >
        <Box
          component="span"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography component="h3" variant="h5">
            {name}
          </Typography>

          <Stack gap={1}>
            <Typography variant="caption">Tasks: {totalNumberOfTasks}</Typography>

            <Typography variant="caption">Created: {formatDateOfCreation(dateOfCreation)}</Typography>
          </Stack>
        </Box>
      </Link>
    </Paper>
  );
};
