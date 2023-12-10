import { Modal as MuiModal, Paper } from "@mui/material";

import { ModalProps } from "./Modal.types";

export const Modal = ({ open, children, onClose }: ModalProps) => {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Paper
        sx={{
          width: "85%",
          maxWidth: "500px",
          p: 4,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {children}
      </Paper>
    </MuiModal>
  );
};
