import { TextField, MenuItem } from "@mui/material";

import type { SelectColumnProps } from "./SelectColumn.types";

export const SelectColumn = ({ options, ...props }: SelectColumnProps) => {
  return (
    <TextField select fullWidth label="Column" {...props}>
      {options?.map(({ columnId, status }) => {
        return (
          <MenuItem key={columnId} value={columnId}>
            {status}
          </MenuItem>
        );
      })}
    </TextField>
  );
};
