import { useState, MouseEvent, useId } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppBar as MuiAppBar, Toolbar, IconButton, Typography, Container, Avatar, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

import { ActionMenu } from "src/components/ActionMenu/ActionMenu";
import { logout, selectAuth } from "src/features/auth/authSlice";
import { getUserInitials } from "src/utils/getUserInitials";
import { useAppDispatch, useAppSelector } from "src/store";
import { useGetBoardDetailsQuery } from "src/api/boardApi";
import { showAlert } from "src/features/alert/alertSlice";
import { useGetUserDetailsQuery } from "src/api/userApi";

import type { AppBarProps } from "./AppBar.types";

export const AppBar = ({ drawerWidth, onToggleDrawer }: AppBarProps) => {
  const params = useParams();
  const userMenuId = useId();
  const location = useLocation();
  const navigate = useNavigate();
  const moreMenuButtonId = useId();
  const dispatch = useAppDispatch();
  const { id } = useAppSelector(selectAuth);
  const { data: userDetails } = useGetUserDetailsQuery(id || skipToken);
  const { data: boardDetails } = useGetBoardDetailsQuery(params.boardId ?? skipToken);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLButtonElement>(null);

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
          <Stack direction="row" alignItems="center" gap={3}>
            <IconButton
              aria-label="Open drawer"
              onClick={onToggleDrawer}
              sx={{
                display: {
                  sm: "none",
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            {showExtraContent && (
              <Stack direction="row" alignItems="center" gap={1}>
                <IconButton onClick={() => navigate(-1)}>
                  <ArrowBackIcon />
                </IconButton>

                <Typography variant="h6">{boardDetails?.name}</Typography>
              </Stack>
            )}
          </Stack>

          {userDetails && (
            <IconButton
              id={moreMenuButtonId}
              aria-controls={userMenuOpen ? userMenuId : undefined}
              aria-haspopup="true"
              aria-expanded={userMenuOpen ? "true" : undefined}
              onClick={handleOpenUserMenu}
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
                gap: 2,
              }}
            >
              <Avatar alt="User Avatar">{getUserInitials(userDetails)}</Avatar>
            </IconButton>
          )}

          <ActionMenu
            id={userMenuId}
            anchorEl={userMenuAnchorEl}
            open={userMenuOpen}
            aria-labelledby={moreMenuButtonId}
            onClose={handleCloseUserMenu}
            menuItems={[
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
