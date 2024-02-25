import { Grid } from "@mui/material";
import React from "react";

interface WealthProps {
  usd: number;
  uzs: number;
}

export function Wealth({ usd, uzs }: WealthProps) {
  return (
    <Grid>
      <div>
        Hello, {usd}$, {uzs} so'm
      </div>
    </Grid>
  );
}
