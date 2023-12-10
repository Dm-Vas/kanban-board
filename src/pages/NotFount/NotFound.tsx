import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: 96, marginBottom: 4 }}>
        404
      </Typography>

      <Typography variant="h5" sx={{ fontSize: 24, marginBottom: 4 }}>
        Oops! Page not found.
      </Typography>

      <Typography variant="body1" sx={{ fontSize: 16, marginBottom: 4 }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>

      <Button variant="contained" color="primary" size="large" startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
        Go back
      </Button>
    </Box>
  );
};
