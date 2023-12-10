import { useNavigate, useParams } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import { useAppDispatch, useAppSelector } from "src/store";
import { useDeleteBoardMutation, useDeleteColumnMutation, useDeleteTaskMutation } from "src/api/boardApi";
import { closeConfirmationDialog } from "src/features/confirmationDialog/confirmationDialogSlice";
import { AlertState, showAlert } from "src/features/alert/alertSlice";

import { ConfirmationKey } from "./ConfirmationDialog.types";

export const ConfirmationDialog = () => {
  const { isOpen, title, content, confirmationButtonLabel, confirmationKey, deleteItemId } = useAppSelector(
    (state) => state.dialog
  );
  const { boardId, columnId, taskId } = useParams();
  const [deleteBoard] = useDeleteBoardMutation();
  const [deleteColumn] = useDeleteColumnMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeConfirmationDialog());
  };

  const confirmationMap: Record<
    ConfirmationKey,
    () =>
      | Promise<void | {
          payload: Omit<AlertState, "shown">;
          type: "alert/showAlert";
        }>
      | undefined
  > = {
    deleteBoard: () => {
      if (!deleteItemId) return;

      return deleteBoard(deleteItemId)
        .unwrap()
        .then(() => {
          dispatch(showAlert({ severity: "success", message: "Board deleted successfully!" }));
          handleClose();
        })
        .catch(() => dispatch(showAlert({ severity: "error", message: "Something went wrong. Please try again." })));
    },

    deleteColumn: () => {
      if (!deleteItemId) return;

      return deleteColumn(deleteItemId)
        .unwrap()
        .then(() => {
          dispatch(showAlert({ severity: "success", message: "Column and related tasks deleted successfully!" }));
          handleClose();
        })
        .catch(() => dispatch(showAlert({ severity: "error", message: "Something went wrong. Please try again." })));
    },

    deleteTask: () => {
      if (!taskId) return;

      return deleteTask({ taskId })
        .unwrap()
        .then(() => {
          dispatch(showAlert({ severity: "success", message: "Task deleted successfully!" }));
          handleClose();
          navigate(-1);
        })
        .catch(() => dispatch(showAlert({ severity: "error", message: "Something went wrong. Please try again." })));
    },
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        <Button
          color="error"
          variant="contained"
          onClick={confirmationKey ? confirmationMap[confirmationKey] : undefined}
        >
          {confirmationButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
