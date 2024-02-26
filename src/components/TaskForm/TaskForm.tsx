import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { Controller } from "react-hook-form";
import { Typography, TextField, Button, Stack } from "@mui/material";

import { closeTaskForm, selectTaskForm } from "src/features/taskForm/taskFormSlice";
import { SelectAssignee } from "src/components/SelectAssignee/SelectAssignee";
import { SelectColumn } from "src/components/SelectColumn/SelectColumn";
import { useGetTaskStatuses } from "src/hooks/useGetTaskStatuses";
import { useAppDispatch, useAppSelector } from "src/store";
import { useCreateTaskMutation } from "src/api/boardApi";
import { showAlert } from "src/features/alert/alertSlice";
import { useGetAllUsersQuery } from "src/api/userApi";
import { useTaskForm } from "src/hooks/useTaskForm";
import { Modal } from "src/components/Modal/Modal";

export const TaskForm = () => {
  const { data: users } = useGetAllUsersQuery();
  const { isOpen, columnId, boardId } = useAppSelector(selectTaskForm);
  const [createTaskMutation, createTaskMutationDetails] = useCreateTaskMutation();
  const statuses = useGetTaskStatuses(boardId);
  const dispatch = useAppDispatch();
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useTaskForm();

  useEffect(() => {
    if (columnId) {
      reset({
        column: columnId,
      });
    }
  }, [columnId, reset]);

  const handleSubmitForm = handleSubmit((data) => {
    if (!columnId) return;

    createTaskMutation({
      task: {
        status: "",
        title: data.title,
        columnId: data.column,
        description: data.description,
        userAttached: data.assignee,
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
    <Modal open={isOpen} onClose={handleCloseTaskForm}>
      <Stack component="form" onSubmit={handleSubmitForm} direction="column" spacing={4}>
        <Typography align="center" variant="h5" marginBottom={5}>
          Add Task
        </Typography>

        <TextField
          {...register("title")}
          label="Title"
          variant="standard"
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
          error={!!errors.description}
          helperText={errors.description?.message}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Controller
          name="column"
          control={control}
          render={({ field }) => {
            return <SelectColumn options={statuses} {...field} />;
          }}
        />

        <Controller
          name="assignee"
          control={control}
          render={({ field }) => {
            return <SelectAssignee options={users} isAnyOptionsSelected={!!watch("assignee")} {...field} />;
          }}
        />

        <Stack gap={2}>
          <LoadingButton
            type="submit"
            color="primary"
            variant="contained"
            loading={createTaskMutationDetails.isLoading}
            loadingIndicator="Creating task..."
          >
            Add Task
          </LoadingButton>

          <Button type="button" color="primary" variant="outlined" onClick={handleCloseTaskForm}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
