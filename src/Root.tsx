import { Navigate, Route } from "react-router-dom";

import { DashboardLayout } from "./pages/DashboardLayout/DashboardLayout";
import { RequireAuth } from "./components/RequireAuth/RequireAuth";
import { TaskDetails } from "./components/TaskDetails/TaskDetails";
import { BoardDetails } from "./pages/BoardDetails/BoardDetails";
import { NotFound } from "./pages/NotFount/NotFound";
import { Settings } from "./pages/Settings/Settings";
import { Register } from "./pages/Register/Register";
import { Boards } from "./pages/Boards/Boards";
import { Login } from "./pages/Login/Login";

export const Root = (
  <Route>
    <Route path="/" element={<Navigate to="dashboard/boards" replace />} />

    <Route
      path="dashboard"
      element={
        <RequireAuth>
          <DashboardLayout />
        </RequireAuth>
      }
    >
      <Route path="boards" element={<Boards />} />

      <Route path="boards/:boardId" element={<BoardDetails />}>
        <Route path="column/:columnId/task/:taskId" element={<TaskDetails />} />
      </Route>

      <Route path="settings" element={<Settings />} />
    </Route>

    <Route path="login" element={<Login />} />

    <Route path="register" element={<Register />} />

    <Route path="*" element={<NotFound />} />
  </Route>
);
