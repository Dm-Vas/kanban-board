import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";

import { ActionMenuProps } from "./ActionMenu.types";

export const ActionMenu = ({ menuItems, ...props }: ActionMenuProps) => {
  return (
    <Menu
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      {...props}
    >
      {menuItems.map(({ icon, label, onClick }) => (
        <MenuItem key={label} onClick={onClick}>
          <ListItemIcon>{icon}</ListItemIcon>

          <ListItemText>{label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};
