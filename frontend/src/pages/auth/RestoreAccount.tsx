import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  Grid,
  Link,
} from "@mui/material";
import AxiosClient, { AxiosError } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const theme = createTheme();

export default function RestoreAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState({
    value: "",
    error: false,
    message: "",
  });

  const [alert, setAlert] = useState({ state: false, message: "" });
  const [sendRequest, setSendRequest] = useState(false);

  const validateFields = () => {
    let isValid = true;

    if (!email.value) {
      setEmail((prev) => ({
        ...prev,
        error: true,
        message: "Email is required",
      }));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      setEmail((prev) => ({
        ...prev,
        error: true,
        message: "Invalid email format",
      }));
      isValid = false;
    } else {
      setEmail((prev) => ({ ...prev, error: false, message: "" }));
    }

    return !isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateFields()) return;

    setSendRequest(true);

    try {
      await AxiosClient.post("/auth/restore", {
        email: email.value,
      });
      navigate(`/restore/verify?email=${email.value}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      setSendRequest(false);
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unknown error";

      if (["User not found"].some((e) => errorMessage.includes(e))) {
        setAlert({ state: true, message: "Account not found" });
      } else {
        setAlert({ state: true, message: errorMessage });
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#1976d2" }}>
            <AccountBalanceWalletIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Restore account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="email"
              type="text"
              label="Email"
              name="email"
              onChange={(e) => setEmail({ ...email, value: e.target.value })}
              value={email.value}
              required={true}
              helperText={email.message}
              error={email.error}
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset password
            </Button>

            <Grid container>
              <Grid item xs>
                <Link
                  href="login"
                  variant="body2"
                  sx={{ textDecoration: "none" }}
                >
                  Back to login page
                </Link>
              </Grid>
            </Grid>
          </Box>
          {sendRequest && <LoadingBar />}
          {alert.state && <HttpErrorNotification message={alert.message} />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
