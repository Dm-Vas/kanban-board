import { useForm } from "react-hook-form";
import { Box, Toolbar, Typography, TextField, Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DevTool } from "@hookform/devtools";

import { useAppDispatch, useAppSelector } from "src/store";
import { useCreateTaskMutation } from "src/api/boardApi";
import { closeTaskForm } from "src/features/taskForm/taskFormSlice";
import { showAlert } from "src/features/alert/alertSlice";

import { Modal } from "src/components/Modal/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormValidationSchema } from "src/utils/validationSchemas";
import { TaskFormValues } from "src/models/forms";

export const TaskForm = () => {
  const { isOpen, columnId, columnName } = useAppSelector((state) => state.taskForm);
  const [createTaskMutation, createTaskMutationDetails] = useCreateTaskMutation();
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    reset,
    control,
    register,
    formState: { isSubmitting, errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormValidationSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleSubmitForm = handleSubmit((data) => {
    if (!columnId || !columnName) return;

    createTaskMutation({
      task: {
        columnId,
        title: data.title,
        description: data.description,
        status: columnName,
      },
    })
      .unwrap()
      .then(() => {
        dispatch(
          showAlert({
            severity: "success",
            message: "New task successfully created!",
          })
        );
        handleCloseTaskForm();
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

  const handleCloseTaskForm = () => {
    reset();
    dispatch(closeTaskForm());
  };

  return (
    <>
      <Modal open={isOpen} onClose={handleCloseTaskForm}>
        <Box component="form" onSubmit={handleSubmitForm}>
          <Typography variant="h5" marginBottom={5}>
            Create Task
          </Typography>

          <Stack gap={5}>
            <Stack gap={3}>
              <TextField
                label="Title"
                variant="standard"
                error={!!errors.title}
                helperText={errors.title?.message}
                {...register("title")}
              />

              <TextField
                label="Description"
                variant="standard"
                error={!!errors.description}
                helperText={errors.description?.message}
                {...register("description")}
              />
            </Stack>

            <Stack gap={2}>
              <LoadingButton
                type="submit"
                color="primary"
                variant="contained"
                loading={isSubmitting || createTaskMutationDetails.isLoading}
                loadingIndicator="Creating task..."
              >
                Create Task
              </LoadingButton>

              <Button type="button" color="primary" variant="outlined" onClick={handleCloseTaskForm}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <DevTool control={control} />
    </>
  );
};
