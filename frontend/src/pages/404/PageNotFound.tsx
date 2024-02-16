import * as React from "react";
import { Link } from "react-router-dom";
import { Alert, AlertTitle } from "@mui/material";

export default function PageNotFound() {
  return (
    <Alert severity="warning">
      <AlertTitle>404 - Sahifa topilmadi</AlertTitle>
      <Link to="/">Bosh sahifa</Link>
    </Alert>
  );
}
