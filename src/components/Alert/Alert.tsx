import { Snackbar, Alert as MuiAlert, AlertTitle } from "@mui/material";

import { useAppDispatch, useAppSelector } from "src/store";
import { hideAlert, selectAlert } from "src/features/alert/alertSlice";

export const Alert = () => {
  const { shown, severity, title, message } = useAppSelector(selectAlert);
  const dispatch = useAppDispatch();

  const handleHideAlert = () => {
    dispatch(hideAlert());
  };

  return (
    <Snackbar
      open={shown}
      autoHideDuration={6000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      onClose={handleHideAlert}
    >
      <MuiAlert variant="filled" severity={severity} onClose={handleHideAlert}>
        {title && <AlertTitle>{title}</AlertTitle>}

        {message}
      </MuiAlert>
    </Snackbar>
  );
};
