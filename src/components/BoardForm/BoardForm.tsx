import { useId } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button, IconButton, Stack, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DevTool } from "@hookform/devtools";

import { showAlert } from "src/features/alert/alertSlice";
import { closeBoardForm } from "src/features/boardForm/boardFormSlice";
import { useCreateBoardMutation } from "src/api/boardApi";
import { useAppDispatch, useAppSelector } from "src/store";

import { CreateBoardFormValues } from "src/models/forms";
import { LoadingButton } from "@mui/lab";
import { Modal } from "src/components/Modal/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBoardFormValidationSchema } from "src/utils/validationSchemas";

export const BoardForm = () => {
  const titleId = useId();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.boardForm);
  const [createBoardMutation, createBoardMutationDetails] = useCreateBoardMutation();
  const {
    formState: { isSubmitting, errors },
    control,
    register,
    handleSubmit,
    reset,
  } = useForm<CreateBoardFormValues>({
    resolver: zodResolver(createBoardFormValidationSchema),
    defaultValues: {
      name: "",
      columns: [
        {
          name: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const handleCreateBoard = handleSubmit((data) => {
    createBoardMutation({
      name: data.name,
      columns: data.columns,
    })
      .unwrap()
      .then(() => {
        dispatch(
          showAlert({
            severity: "success",
            message: "New board successfully created!",
          })
        );
        handleCloseBoardForm();
        navigate("/dashboard/boards");
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

  const handleCloseBoardForm = () => {
    reset();
    dispatch(closeBoardForm());
  };

  return (
    <>
      <Modal open={isOpen} onClose={handleCloseBoardForm}>
        <Box>
          <Typography variant="h5" marginBottom={4}>
            Create Board
          </Typography>

          <IconButton
            type="button"
            onClick={handleCloseBoardForm}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Stack component="form" onSubmit={handleCreateBoard} gap={2}>
            <TextField
              id={titleId}
              label="Enter board name"
              error={!!errors.name}
              helperText={errors.name?.message}
              // InputLabelProps={{
              //   shrink: true,
              // }}
              {...register("name")}
            />

            {!!fields.length && <Typography variant="caption">Columns</Typography>}

            <Stack gap={2}>
              {fields.map((field, index) => (
                <Stack key={field.id} direction="row" alignItems="flex-start" gap={1}>
                  <TextField
                    id={field.id}
                    fullWidth
                    error={!!errors.columns?.[index]}
                    helperText={errors.columns?.[index]?.name?.message}
                    {...register(`columns.${index}.name`)}
                  />

                  <IconButton
                    type="button"
                    size="small"
                    onClick={() => remove(index)}
                    sx={{
                      marginTop: "10px",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Stack gap={1}>
              <Button type="button" variant="outlined" onClick={() => append({ name: "" })}>
                + Add New Column
              </Button>

              <LoadingButton
                type="submit"
                color="primary"
                variant="contained"
                loadingIndicator="Creating..."
                loading={isSubmitting || createBoardMutationDetails.isLoading}
              >
                Create New Board
              </LoadingButton>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <DevTool control={control} />
    </>
  );
};
