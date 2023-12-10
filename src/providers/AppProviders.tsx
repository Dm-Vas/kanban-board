import { createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { Root } from "src/Root";
import { useAppSelector } from "src/store";
import { selectThemeMode } from "src/features/themeMode/themeModeSlice";
import { Alert } from "src/components/Alert/Alert";

const router = createBrowserRouter(createRoutesFromElements(Root));

export const AppProviders = () => {
  const { mode } = useAppSelector(selectThemeMode);

  const theme = createTheme({ palette: { mode } });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <Alert />
    </ThemeProvider>
  );
};
