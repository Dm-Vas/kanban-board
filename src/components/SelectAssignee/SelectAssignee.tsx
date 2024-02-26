import { TextField, MenuItem } from "@mui/material";

import type { SelectAssigneeProps } from "./SelectAssignee.types";

export const SelectAssignee = ({ options, isAnyOptionsSelected, ...props }: SelectAssigneeProps) => {
  return (
    <TextField select fullWidth label="Assignee" {...props}>
      {isAnyOptionsSelected && <MenuItem value="">Unassigned</MenuItem>}

      {options?.map(({ id, firstName, lastName, userName }) => (
        <MenuItem key={id} value={id}>
          {`${firstName} ${lastName} (${userName})`}
        </MenuItem>
      ))}
    </TextField>
  );
};
