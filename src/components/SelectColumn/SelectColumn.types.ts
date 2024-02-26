import type { TextFieldProps } from "@mui/material";

export type SelectColumnProps = TextFieldProps & {
  options?: {
    status: string;
    columnId: string;
  }[];
};
