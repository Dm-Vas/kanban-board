import { Box } from "@mui/material";

import { AppBar } from "src/components/AppBar/AppBar";
import { Drawer } from "src/components/Drawer/Drawer";
import { MainPanel } from "src/components/MainPanel/MainPanel";
import { BoardForm } from "src/components/BoardForm/BoardForm";
import { ConfirmationDialog } from "src/components/ConfirmationDialog/ConfirmationDialog";
import { TaskForm } from "src/components/TaskForm/TaskForm";
import { SingleInputForm } from "src/components/SingleInputForm/SingleInputForm";

const DRAWER_WIDTH = 240;

export const DashboardLayout = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBar drawerWidth={DRAWER_WIDTH} />
      <Drawer drawerWidth={DRAWER_WIDTH} />
      <MainPanel drawerWidth={DRAWER_WIDTH} />

      <BoardForm />
      <TaskForm />
      <SingleInputForm />
      <ConfirmationDialog />
    </Box>
  );
};
