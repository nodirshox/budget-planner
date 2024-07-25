import React from "react";
import Paper from "@mui/material/Paper";
import { Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReorderIcon from "@mui/icons-material/Reorder";
import PasswordIcon from "@mui/icons-material/Password";

export default function Settings() {
  const nav = useNavigate();

  const logoutHandler = (path: string) => nav(path);

  return (
    <Paper sx={{ p: 1, mt: 2 }}>
      <Grid container spacing={2} direction="row">
        <Grid
          item
          container
          xs={12}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Settings</Typography>
          <div>
            <Button
              variant="outlined"
              onClick={() => logoutHandler("/home")}
              size="small"
              sx={{ p: 1 }}
            >
              <HomeIcon />
            </Button>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={() => logoutHandler("/wallets/create")}
            sx={{ p: 1 }}
            size="small"
          >
            <AccountBalanceWalletIcon /> New wallet
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={() => logoutHandler("/categories")}
            sx={{ p: 1 }}
            size="small"
          >
            <ReorderIcon /> Categories
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={() => logoutHandler("/settings/password")}
            size="small"
            sx={{ p: 1 }}
          >
            <PasswordIcon /> Change password
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={() => logoutHandler("/logout")}
            size="small"
            sx={{ p: 1 }}
          >
            <ExitToAppIcon /> Logout
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
