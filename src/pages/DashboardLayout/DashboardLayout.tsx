import { useState } from "react";
import { Box } from "@mui/material";

import { AppBar } from "src/components/AppBar/AppBar";
import { Drawer } from "src/components/Drawer/Drawer";
import { TaskForm } from "src/components/TaskForm/TaskForm";
import { MainPanel } from "src/components/MainPanel/MainPanel";
import { SingleInputForm } from "src/components/SingleInputForm/SingleInputForm";
import { ConfirmationDialog } from "src/components/ConfirmationDialog/ConfirmationDialog";

const DRAWER_WIDTH = 240;

export const DashboardLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleToggleDrawer = () => {
    setIsDrawerOpen((prevIsDrawerOpen) => !prevIsDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBar drawerWidth={DRAWER_WIDTH} onToggleDrawer={handleToggleDrawer} />

      <Drawer isOpen={isDrawerOpen} drawerWidth={DRAWER_WIDTH} onCloseDrawer={handleCloseDrawer} />

      <MainPanel drawerWidth={DRAWER_WIDTH} />

      <TaskForm />
      <SingleInputForm />
      <ConfirmationDialog />
    </Box>
  );
};
