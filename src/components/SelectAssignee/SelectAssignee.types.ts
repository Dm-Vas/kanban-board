import type { TextFieldProps } from "@mui/material";

import type { User } from "src/api/models/user";

export type SelectAssigneeProps = TextFieldProps & {
  options?: User[];
  isAnyOptionsSelected: boolean;
};
