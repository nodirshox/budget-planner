import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";

function DashboardContent() {
  return (
    <React.Fragment>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />

      <Container component="main" disableGutters={true} sx={{ pl: 1, pr: 1 }}>
        <Outlet />
      </Container>
    </React.Fragment>
  );
}

export default function DashboardLayout() {
  return <DashboardContent />;
}
