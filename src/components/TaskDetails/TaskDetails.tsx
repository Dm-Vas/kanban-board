import { IconButton, Paper, Button, Stack, TextField } from "@mui/material";
import { MouseEvent, useId, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller } from "react-hook-form";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";

import { openConfirmationDialog } from "src/features/confirmationDialog/confirmationDialogSlice";
import { useEditTaskMutation, useGetBoardDetailsQuery } from "src/api/boardApi";
import { SelectAssignee } from "src/components/SelectAssignee/SelectAssignee";
import { SelectColumn } from "src/components/SelectColumn/SelectColumn";
import { ActionMenu } from "src/components/ActionMenu/ActionMenu";
import { useGetTaskStatuses } from "src/hooks/useGetTaskStatuses";
import { showAlert } from "src/features/alert/alertSlice";
import { useGetAllUsersQuery } from "src/api/userApi";
import { useTaskForm } from "src/hooks/useTaskForm";
import { Modal } from "src/components/Modal/Modal";
import { useAppDispatch } from "src/store";

export const TaskDetails = () => {
  const moreMenuId = useId();
  const navigate = useNavigate();
  const moreMenuButtonId = useId();
  const dispatch = useAppDispatch();
  const { data: users } = useGetAllUsersQuery();
  const [isEdited, setIsEdited] = useState(false);
  const { boardId, columnId, taskId } = useParams();
  const { data: board } = useGetBoardDetailsQuery(boardId ?? skipToken);
  const [editTaskMutation, editTaskMutationDetails] = useEditTaskMutation();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(null);

  const taskDetails = board?.columns.find((column) => column.id === columnId)?.tasks.find((task) => task.id === taskId);

  const statuses = useGetTaskStatuses(board?.id);
  const {
    control,
    formState: { isDirty, errors },
    handleSubmit,
    register,
    watch,
    reset,
  } = useTaskForm();

  useEffect(() => {
    reset({
      column: columnId,
      title: taskDetails?.title,
      description: taskDetails?.description,
      assignee: taskDetails?.userAttached || "",
    });
  }, [columnId, taskDetails?.description, taskDetails?.title, taskDetails?.userAttached, reset]);

  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const handleOpenMoreMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setMoreMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMoreMenu = () => {
    setMoreMenuAnchorEl(null);
  };

  const handleEditTask = () => {
    setIsEdited(true);
    handleCloseMoreMenu();
  };

  const handleSaveChanges = handleSubmit((data) => {
    if (!taskId || !columnId) return;

    editTaskMutation({
      status: "",
      id: taskId,
      title: data.title,
      columnId: data.column,
      userAttached: data.assignee,
      description: data.description,
    })
      .unwrap()
      .then(() => {
        setIsEdited(false);
        navigate(-1);
        dispatch(
          showAlert({
            severity: "success",
            message: "Task updated successfully!",
          })
        );
      })
      .catch(() => {
        dispatch(
          showAlert({
            severity: "error",
            message: "Something went wrong. Please try again.",
          })
        );
      });
  });

  const handleCancelChanges = () => {
    setIsEdited(false);
  };

  const handleDeleteTask = () => {
    handleCloseMoreMenu();
    dispatch(
      openConfirmationDialog({
        title: "Delete task?",
        content: `Are you sure you want to delete the "${taskDetails?.title}" task? This action cannot be undone.`,
        confirmationButtonLabel: "Delete",
        confirmationKey: "deleteTask",
        deleteItemId: taskId,
      })
    );
  };

  return (
    <Modal open onClose={() => navigate(-1)}>
      <Paper
        sx={{
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          padding: "60px 30px 30px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          outline: "none",
        }}
      >
        <IconButton
          id={moreMenuButtonId}
          aria-controls={moreMenuOpen ? moreMenuId : undefined}
          aria-haspopup="true"
          aria-expanded={moreMenuOpen ? "true" : undefined}
          onClick={handleOpenMoreMenu}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          <MoreVertIcon />
        </IconButton>

        <ActionMenu
          id={moreMenuId}
          aria-labelledby={moreMenuButtonId}
          anchorEl={moreMenuAnchorEl}
          open={moreMenuOpen}
          onClose={handleCloseMoreMenu}
          menuItems={[
            ...(!isEdited
              ? [
                  {
                    icon: <EditIcon />,
                    label: "Edit Task",
                    onClick: handleEditTask,
                  },
                ]
              : []),
            {
              icon: <DeleteIcon />,
              label: "Delete Task",
              onClick: handleDeleteTask,
            },
          ]}
        />

        <Stack component={isEdited ? "form" : "div"} direction="column" spacing={4} onSubmit={handleSaveChanges}>
          <TextField
            {...register("title")}
            label="Title"
            variant="standard"
            disabled={!isEdited}
            error={!!errors.title}
            helperText={errors.title?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            {...register("description")}
            multiline
            minRows={1}
            maxRows={5}
            variant="standard"
            label="Description"
            disabled={!isEdited}
            error={!!errors.description}
            helperText={errors.description?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Controller
            name="column"
            control={control}
            disabled={!isEdited}
            render={({ field }) => {
              return <SelectColumn options={statuses} {...field} />;
            }}
          />

          <Controller
            name="assignee"
            control={control}
            disabled={!isEdited}
            render={({ field }) => {
              return <SelectAssignee options={users} isAnyOptionsSelected={!!watch("assignee")} {...field} />;
            }}
          />

          {isEdited && (
            <Stack direction="column" spacing={2}>
              <LoadingButton
                type="submit"
                color="primary"
                variant="contained"
                disabled={!isDirty}
                loadingIndicator="Saving changes..."
                loading={editTaskMutationDetails.isLoading}
              >
                Save changes
              </LoadingButton>

              <Button type="button" color="primary" variant="outlined" onClick={handleCancelChanges}>
                Cancel
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Modal>
  );
};
