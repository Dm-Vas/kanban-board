import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer as MuiDrawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";

import { ThemeToggler } from "src/components/ThemeToggler/ThemeToggler";

import { DrawerProps } from "./Drawer.types";

export const Drawer = ({ drawerWidth }: DrawerProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const drawer = (
    <>
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <Typography component="h3">KANBAN</Typography>
      </Toolbar>

      <Divider />

      <List sx={{ height: "100%", display: "flex", flexDirection: "column" }} disablePadding>
        <ListItem disablePadding>
          <ListItemButton selected={pathname === "/dashboard/boards"} onClick={() => navigate(`/dashboard/boards`)}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>

            <ListItemText primary="Boards" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton selected={pathname === "/dashboard/settings"} onClick={() => navigate(`/dashboard/settings`)}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>

            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ marginTop: "auto" }} />

        <ListItem disablePadding sx={{ justifyContent: "center" }}>
          <ThemeToggler />
        </ListItem>
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: {
          sm: drawerWidth,
        },
        flexShrink: {
          sm: 0,
        },
      }}
      aria-label="drawer"
    >
      <MuiDrawer
        // container={container}
        anchor="left"
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </MuiDrawer>

      <MuiDrawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </MuiDrawer>
    </Box>
  );
};
