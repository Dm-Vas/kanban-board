import { Stack, Switch } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useAppSelector, useAppDispatch } from "src/store";
import { selectThemeMode, toggleThemeMode } from "src/features/themeMode/themeModeSlice";

export const ThemeToggler = () => {
  const { mode } = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();

  const handleSwitchTheme = () => {
    dispatch(toggleThemeMode());
  };

  return (
    <Stack direction="row" alignItems="center" alignSelf="center" spacing={1}>
      <LightModeIcon />

      <Switch inputProps={{ "aria-label": "Mode" }} checked={mode === "dark"} onChange={handleSwitchTheme} />

      <DarkModeIcon />
    </Stack>
  );
};
