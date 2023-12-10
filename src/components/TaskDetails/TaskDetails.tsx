import { MouseEvent, useId, useState, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { DevTool } from "@hookform/devtools";
import {
  Modal,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Checkbox,
  ListSubheader,
  Button,
  Stack,
  FormControl,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useAppDispatch } from "src/store";
import { useEditTaskMutation, useGetBoardDetailsQuery } from "src/api/boardApi";
import { openConfirmationDialog } from "src/features/confirmationDialog/confirmationDialogSlice";

import { ActionMenu } from "src/components/ActionMenu/ActionMenu";
import { showAlert } from "src/features/alert/alertSlice";
import { useGetTaskStatuses } from "src/hooks/useGetTaskStatuses";
import { LoadingButton } from "@mui/lab";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditTaskFormValues } from "src/models/forms";
import { editTaskFormValidationSchema } from "src/utils/validationSchemas";

export const TaskDetails = () => {
  const titleId = useId();
  const statusId = useId();
  const moreMenuId = useId();
  const descriptionId = useId();
  const moreMenuButtonId = useId();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isEdited, setIsEdited] = useState(false);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(null);
  const { boardId, columnId, taskId } = useParams();
  const { data: board } = useGetBoardDetailsQuery(boardId ?? skipToken);
  const [editTaskMutation, editTaskMutationDetails] = useEditTaskMutation();

  const columnName = board?.columns.find((column) => column.id === columnId)?.name;
  const taskDetails = board?.columns.find((column) => column.id === columnId)?.tasks.find((task) => task.id === taskId);

  const statuses = useGetTaskStatuses(board?.id);
  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
    reset,
  } = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskFormValidationSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
    },
    mode: "onSubmit",
  });

  useLayoutEffect(() => {
    reset({
      title: taskDetails?.title,
      description: taskDetails?.description,
      status: columnId,
    });
  }, [reset, taskDetails]);

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
      id: taskId,
      columnId: data.status,
      title: data.title,
      description: data.description,
      status: "",
    })
      .unwrap()
      .then(() => {
        setIsEdited(false);
        handleCloseTaskDetails();
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
        content: "Are you sure you want to delete this task? This action cannot be undone.",
        confirmationButtonLabel: "Delete",
        confirmationKey: "deleteTask",
        deleteItemId: taskId,
      })
    );
  };

  const handleCloseTaskDetails = () => {
    navigate(-1);
  };

  return (
    <>
      <Modal open onClose={handleCloseTaskDetails}>
        <Paper
          sx={{
            width: "500px",
            display: "flex",
            flexDirection: "column",
            padding: "60px 30px 30px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
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

          <Stack component={isEdited ? "form" : "div"} direction="column" spacing={2} onSubmit={handleSaveChanges}>
            {isEdited ? (
              <TextField
                id={titleId}
                label="Title"
                variant="standard"
                error={!!errors.title}
                helperText={errors.title?.message}
                {...register("title")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <Stack>
                <Typography component="p" variant="h4">
                  Title: {taskDetails?.title}
                </Typography>
              </Stack>
            )}

            {isEdited ? (
              <TextField
                id={descriptionId}
                label="Description"
                variant="standard"
                error={!!errors.title}
                helperText={errors.title?.message}
                {...register("description")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <Typography component="p" variant="h5">
                Description: {taskDetails?.description}
              </Typography>
            )}

            {isEdited ? (
              <Controller
                name="status"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Select id={statusId} value={value} onChange={onChange}>
                      {statuses?.map(({ columnId, status }) => {
                        return (
                          <MenuItem key={columnId} value={columnId}>
                            {status}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  );
                }}
              />
            ) : (
              <Typography component="p" variant="h6">
                Status: {columnName}
              </Typography>
            )}

            {isEdited && (
              <>
                <LoadingButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  loadingIndicator="Saving changes..."
                  loading={isSubmitting || editTaskMutationDetails.isLoading}
                >
                  Save changes
                </LoadingButton>

                <Button color="primary" variant="outlined" onClick={handleCancelChanges}>
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Modal>

      <DevTool control={control} />
    </>
  );
};
