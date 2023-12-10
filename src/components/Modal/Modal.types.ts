import type { ModalProps as MuiModalProps } from "@mui/material";

export type ModalProps = Pick<MuiModalProps, "open" | "onClose" | "children">;
