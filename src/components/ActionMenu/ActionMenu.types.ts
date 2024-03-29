import type { ReactNode } from "react";
import type { MenuItemProps, MenuProps } from "@mui/material";

export type ActionMenuProps = Pick<Required<MenuProps>, "id" | "aria-labelledby" | "anchorEl" | "open" | "onClose"> & {
  menuItems: ActionMenuItem[];
};

type ActionMenuItem = Pick<MenuItemProps, "onClick"> & {
  icon: ReactNode;
  label: string;
};
