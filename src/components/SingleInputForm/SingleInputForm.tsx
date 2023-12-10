import { useEffect, useId } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Stack, Button, TextField } from "@mui/material";
import { DevTool } from "@hookform/devtools";

import { useAppDispatch, useAppSelector } from "src/store";
import { useCreateColumnMutation, useEditBoardMutation, useEditColumnMutation } from "src/api/boardApi";
import { closeSingleInputForm, selectSingleInputForm } from "src/features/singleInputForm/singleInputFormSlice";
import { showAlert } from "src/features/alert/alertSlice";
import { Modal } from "src/components/Modal/Modal";
import { SingleInputFormValues } from "src/models/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { singleInputFormValidationSchema } from "src/utils/validationSchemas";
import { LoadingButton } from "@mui/lab";

export const SingleInputForm = () => {
  const params = useParams();
  const inputId = useId();
  const { isOpen, type, entityId, oldName } = useAppSelector(selectSingleInputForm);
  const dispatch = useAppDispatch();
  const [editBoardMutation, editBoardMutationDetails] = useEditBoardMutation();
  const [createColumnMutation, createColumnMutationDetails] = useCreateColumnMutation();
  const [editColumnMutation, editColumnMutationDetails] = useEditColumnMutation();
  const { formState, control, register, handleSubmit, reset } = useForm<SingleInputFormValues>({
    resolver: zodResolver(singleInputFormValidationSchema),
    defaultValues: {
      name: "",
    },
  });

  const isSavingBoard = editBoardMutationDetails.isLoading;
  const isCreatingColumn = createColumnMutationDetails.isLoading;
  const isEditingColumn = editColumnMutationDetails.isLoading;

  const isSaveButtonLoading = formState.isSubmitting || isSavingBoard || isCreatingColumn || isEditingColumn;

  useEffect(() => {
    reset({
      name: oldName,
    });
  }, [reset, oldName]);

  const getLabel = () => {
    switch (type) {
      case "rename-board":
        return "Enter board name";

      case "add-column":
      case "rename-column":
        return "Column name";

      default:
        return undefined;
    }
  };

  const handleSaveName = handleSubmit((data) => {
    if (!entityId) return;

    switch (type) {
      case "rename-board":
        return editBoardMutation({
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
            handleCancel();
          })
          .catch(() =>
            dispatch(
              showAlert({
                severity: "error",
                message: "Something went wrong. Please try again.",
              })
            )
          );

      case "add-column":
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
            handleCancel();
          })
          .catch(() => {
            dispatch(
              showAlert({
                severity: "error",
                message: "Something went wrong. Please try again.",
              })
            );
          });

      case "rename-column":
        return (
          params.boardId &&
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
              handleCancel();
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

  const handleCancel = () => {
    reset();
    dispatch(closeSingleInputForm());
  };

  return (
    <>
      <Modal open={isOpen} onClose={handleCancel}>
        <Stack component="form" gap={2} onSubmit={handleSaveName}>
          <TextField
            id={inputId}
            label={getLabel()}
            error={!!formState.errors.name}
            helperText={formState.errors.name?.message}
            InputLabelProps={{
              shrink: true,
            }}
            {...register("name")}
          />

          <Stack gap={1}>
            <LoadingButton
              type="submit"
              color="primary"
              variant="contained"
              loadingIndicator="Saving changes..."
              loading={isSaveButtonLoading}
            >
              Save changes
            </LoadingButton>

            <Button type="button" variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Modal>

      <DevTool control={control} />
    </>
  );
};
