import { Modal as MuiModal, Paper } from "@mui/material";

import type { ModalProps } from "./Modal.types";

export const Modal = ({ open, children, onClose }: ModalProps) => {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Paper
        sx={{
          width: "100%",
          maxWidth: "500px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: 4,
        }}
      >
        {children}
      </Paper>
    </MuiModal>
  );
};
