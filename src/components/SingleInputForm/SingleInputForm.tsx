import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { useParams } from "react-router-dom";
import { Stack, Button, TextField, Typography } from "@mui/material";

import { Modal } from "src/components/Modal/Modal";
import { showAlert } from "src/features/alert/alertSlice";
import { useCreateBoardMutation } from "src/api/boardApi";
import { useAppDispatch, useAppSelector } from "src/store";
import { useSingleInputForm } from "src/hooks/useSingleInputForm";
import { useCreateColumnMutation, useEditBoardMutation, useEditColumnMutation } from "src/api/boardApi";
import { closeSingleInputForm, selectSingleInputForm } from "src/features/singleInputForm/singleInputFormSlice";

export const SingleInputForm = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [editBoardMutation, editBoardMutationDetails] = useEditBoardMutation();
  const [editColumnMutation, editColumnMutationDetails] = useEditColumnMutation();
  const { isOpen, type, entityId, oldName } = useAppSelector(selectSingleInputForm);
  const [createBoardMutation, createBoardMutationDetails] = useCreateBoardMutation();
  const [createColumnMutation, createColumnMutationDetails] = useCreateColumnMutation();

  const isEditingBoard = createBoardMutationDetails.isLoading;
  const isRenamingBoard = editBoardMutationDetails.isLoading;
  const isCreatingColumn = createColumnMutationDetails.isLoading;
  const isEditingColumn = editColumnMutationDetails.isLoading;

  const isSaveButtonLoading = isEditingBoard || isRenamingBoard || isCreatingColumn || isEditingColumn;
  const isEditingType = type === "rename-board" || type === "rename-column";

  const getTitle = () => {
    switch (type) {
      case "create-board":
        return "Create Board";

      case "rename-board":
        return "Rename Board";

      case "add-column":
        return "Add Column";

      case "rename-column":
        return "Rename Column";

      default:
        return null;
    }
  };

  const getMessage = () => {
    switch (type) {
      case "create-board":
      case "rename-board":
        return "Board Name field cannot be empty";

      case "add-column":
      case "rename-column":
        return "Column Name field cannot empty";

      default:
        return "";
    }
  };

  const getLabel = () => {
    switch (type) {
      case "create-board":
      case "rename-board":
        return "Board Name";

      case "add-column":
      case "rename-column":
        return "Column Name";

      default:
        return null;
    }
  };

  const { formState, register, handleSubmit, reset } = useSingleInputForm(getMessage());

  const handleCloseForm = () => {
    reset();
    dispatch(closeSingleInputForm());
  };

  const handleSaveName = handleSubmit((data) => {
    switch (type) {
      case "create-board":
        return createBoardMutation({
          name: data.name,
          columns: [],
        })
          .unwrap()
          .then(() => {
            dispatch(
              showAlert({
                severity: "success",
                message: "New board successfully created!",
              })
            );
            handleCloseForm();
          })
          .catch(() => {
            dispatch(
              showAlert({
                severity: "error",
                message: "Something went wrong. Please try again.",
              })
            );
          });

      case "rename-board":
        return (
          !!entityId &&
          editBoardMutation({
            name: data.name,
            id: entityId,
          })
            .unwrap()
            .then(() => {
              dispatch(
                showAlert({
                  severity: "success",
                  message: "Board renamed successfully!",
                })
              );
              handleCloseForm();
            })
            .catch(() =>
              dispatch(
                showAlert({
                  severity: "error",
                  message: "Something went wrong. Please try again.",
                })
              )
            )
        );

      case "add-column":
        return (
          !!entityId &&
          createColumnMutation({
            name: data.name,
            boardId: entityId,
          })
            .unwrap()
            .then(() => {
              dispatch(
                showAlert({
                  severity: "success",
                  message: "Column created successfully!",
                })
              );
              handleCloseForm();
            })
            .catch(() => {
              dispatch(
                showAlert({
                  severity: "error",
                  message: "Something went wrong. Please try again.",
                })
              );
            })
        );

      case "rename-column":
        return (
          !!entityId &&
          !!params.boardId &&
          editColumnMutation({
            id: entityId,
            boardId: params.boardId,
            name: data.name,
          })
            .unwrap()
            .then(() => {
              dispatch(
                showAlert({
                  severity: "success",
                  message: "Column renamed successfully!",
                })
              );
              handleCloseForm();
            })
            .catch(() =>
              dispatch(
                showAlert({
                  severity: "error",
                  message: "Something went wrong. Please try again.",
                })
              )
            )
        );

      default:
        return;
    }
  });

  useEffect(() => {
    if (isEditingType && oldName) {
      reset({
        name: oldName,
      });
    } else {
      reset({ name: "" });
    }
  }, [isEditingType, oldName, reset]);

  return (
    <Modal open={isOpen} onClose={handleCloseForm}>
      <Stack component="form" gap={2} onSubmit={handleSaveName}>
        <Typography align="center" variant="h5" mb={2}>
          {getTitle()}
        </Typography>

        <TextField
          {...register("name")}
          label={getLabel()}
          error={!!formState.errors.name}
          helperText={formState.errors.name?.message}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Stack gap={1}>
          <LoadingButton
            type="submit"
            color="primary"
            variant="contained"
            disabled={isEditingType && !formState.isDirty}
            loading={isSaveButtonLoading}
            loadingIndicator="Saving changes..."
          >
            {getTitle()}
          </LoadingButton>

          <Button type="button" variant="outlined" onClick={handleCloseForm}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
