import { useState, MouseEvent, useId } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  Container,
  Avatar,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAppDispatch } from "src/store";

import { AppBarProps } from "./AppBar.types";
import { logout } from "src/features/auth/authSlice";
import { showAlert } from "src/features/alert/alertSlice";
import { ActionMenu } from "../ActionMenu/ActionMenu";
import { useGetBoardDetailsQuery } from "src/api/boardApi";
import { skipToken } from "@reduxjs/toolkit/dist/query";

export const AppBar = ({ drawerWidth }: AppBarProps) => {
  const params = useParams();
  const { data: boardDetails } = useGetBoardDetailsQuery(params.boardId ?? skipToken);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLButtonElement>(null);
  const userMenuId = useId();
  const moreMenuButtonId = useId();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const userMenuOpen = Boolean(userMenuAnchorEl);
  const showExtraContent = location.pathname !== "/dashboard/boards" && location.pathname !== "/dashboard/settings";

  const handleOpenUserMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login");
    dispatch(
      showAlert({
        severity: "success",
        message: "Logged out successfully!",
      })
    );
  };

  return (
    <MuiAppBar
      color="default"
      position="fixed"
      sx={{
        width: {
          sm: `calc(100% - ${drawerWidth}px)`,
        },
        ml: {
          sm: `${drawerWidth}px`,
        },
      }}
    >
      <Container>
        <Toolbar disableGutters>
          {showExtraContent && (
            <Stack direction="row" alignItems="center" gap={5}>
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </IconButton>

              <Typography variant="h6">{boardDetails?.name}</Typography>
            </Stack>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginLeft: "auto",
            }}
          >
            <IconButton
              id={moreMenuButtonId}
              aria-controls={userMenuOpen ? userMenuId : undefined}
              aria-haspopup="true"
              aria-expanded={userMenuOpen ? "true" : undefined}
              onClick={handleOpenUserMenu}
            >
              <Avatar alt="User Avatar" src="" />
            </IconButton>
          </Box>

          <ActionMenu
            id={userMenuId}
            anchorEl={userMenuAnchorEl}
            open={userMenuOpen}
            aria-labelledby={moreMenuButtonId}
            onClose={handleCloseUserMenu}
            menuItems={[
              {
                icon: <SettingsIcon />,
                label: "Settings",
                onClick: () => navigate("/dashboard/settings"),
              },
              {
                icon: <LogoutIcon />,
                label: "Log Out",
                onClick: handleLogOut,
              },
            ]}
          />
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};
