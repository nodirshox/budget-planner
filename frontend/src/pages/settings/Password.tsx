import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import { Grid, Typography, Button, TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AxiosClient, { AxiosError } from "../../utils/axios";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";

export default function Password() {
  const nav = useNavigate();
  const logoutHandler = (path: string) => nav(path);
  const [oldPassword, setOldPassword] = useState({
    value: "",
    error: false,
    message: "",
  });
  const [newPassword, setNewPassword] = useState({
    value: "",
    error: false,
    message: "",
  });
  const [repeatPassword, setRepeatPassword] = useState({
    value: "",
    error: false,
    message: "",
  });

  const [alert, setAlert] = useState({ state: false, message: "" });
  const [sendRequest, setSendRequest] = useState(false);

  const validateFields = () => {
    let isValid = true;

    if (!oldPassword.value || oldPassword.value.length < 6) {
      setOldPassword((prev) => ({
        ...prev,
        error: true,
        message: "Minimum password 6 characters",
      }));
      isValid = false;
    } else {
      setOldPassword((prev) => ({ ...prev, error: false, message: "" }));
    }

    if (!newPassword.value || newPassword.value.length < 6) {
      setNewPassword((prev) => ({
        ...prev,
        error: true,
        message: "Minimum password 6 characters",
      }));
      isValid = false;
    } else {
      setNewPassword((prev) => ({ ...prev, error: false, message: "" }));
    }

    if (!repeatPassword.value || repeatPassword.value.length < 6) {
      setRepeatPassword((prev) => ({
        ...prev,
        error: true,
        message: "Minimum password 6 characters",
      }));
      isValid = false;
    } else {
      setRepeatPassword((prev) => ({ ...prev, error: false, message: "" }));
    }

    if (
      newPassword.value &&
      repeatPassword &&
      newPassword.value !== repeatPassword.value
    ) {
      setRepeatPassword((prev) => ({
        ...prev,
        error: true,
        message: "Repeat password does not match",
      }));
      isValid = false;
    }

    return !isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateFields()) return;

    setSendRequest(true);

    try {
      await AxiosClient.post("/users/password", {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      });
      nav("/settings");
    } catch (error) {
      const axiosError = error as AxiosError;
      setSendRequest(false);
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unknown error";

      if (
        ["Wrong password", "User not found"].some((e) =>
          errorMessage.includes(e)
        )
      ) {
        setAlert({ state: true, message: "Email or password is incorrect" });
      } else {
        setAlert({ state: true, message: errorMessage });
      }
    }
  };

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
          <Typography variant="h6">Change password</Typography>
          <div>
            <Button
              variant="outlined"
              onClick={() => logoutHandler("/settings")}
              size="small"
              sx={{ p: 1 }}
            >
              <ArrowBackIosIcon />
            </Button>
          </div>
        </Grid>
      </Grid>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <TextField
            id="oldPassword"
            label="Old password"
            value={oldPassword.value}
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setOldPassword({ ...oldPassword, value: e.target.value })
            }
            helperText={oldPassword.message}
            error={oldPassword.error}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <TextField
            id="newPassword"
            label="New password"
            value={newPassword.value}
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setNewPassword({ ...newPassword, value: e.target.value })
            }
            helperText={newPassword.message}
            error={newPassword.error}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <TextField
            id="repeatPassword"
            label="Repeat new password"
            value={repeatPassword.value}
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setRepeatPassword({ ...repeatPassword, value: e.target.value })
            }
            helperText={repeatPassword.message}
            error={repeatPassword.error}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <Button type="submit" variant="contained">
            Set new password
          </Button>
        </Grid>
        {sendRequest && <LoadingBar />}
        {alert.state && <HttpErrorNotification message={alert.message} />}
      </Box>
    </Paper>
  );
}
