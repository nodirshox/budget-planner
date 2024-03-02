import * as React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const nav = useNavigate();
  const homeHandler = () => nav(`/`);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ErrorIcon sx={{ fontSize: 100, mb: 3 }} />
          <Typography variant="h4" component="h4">
            404 - Page not found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={homeHandler}
            sx={{ mt: 2 }}
          >
            Go back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
