import { Outlet } from "react-router-dom";
import { Box, Container, Toolbar } from "@mui/material";

import { MainPanelProps } from "./MainPanel.types";

export const MainPanel = ({ drawerWidth }: MainPanelProps) => {
  return (
    <Box
      component="main"
      sx={{
        width: {
          sm: `calc(100% - ${drawerWidth}px)`,
        },
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <Toolbar />

      <Container
        sx={{
          height: "100%",
          py: 3,
          overflow: "auto",
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};
