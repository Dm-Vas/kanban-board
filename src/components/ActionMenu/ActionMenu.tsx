import { Fragment } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";

import type { ActionMenuProps } from "./ActionMenu.types";

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
      {menuItems.map(({ icon, label, onClick }, index) => {
        const isLast = menuItems.length === index + 1;

        return (
          <Fragment key={label}>
            <MenuItem onClick={onClick}>
              <ListItemIcon>{icon}</ListItemIcon>

              <ListItemText>{label}</ListItemText>
            </MenuItem>

            {!isLast && <Divider />}
          </Fragment>
        );
      })}
    </Menu>
  );
};
