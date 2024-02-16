import Typography from "@mui/material/Typography";
import * as React from "react";

interface IPageTitle {
  title: string;
}

export default function PageTitle(prop: IPageTitle) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {prop.title}
    </Typography>
  );
}
