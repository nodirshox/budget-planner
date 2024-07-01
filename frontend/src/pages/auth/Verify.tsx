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
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const theme = createTheme();

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [token] = useState(searchParams.get("token"));

  const navigate = useNavigate();
  const [otp, setOtp] = useState({
    value: "",
    error: false,
    message: "",
  });

  const [alert, setAlert] = useState({ state: false, message: "" });
  const [sendRequest, setSendRequest] = useState(false);

  const validateFields = () => {
    let isValid = true;

    if (!otp.value) {
      setOtp((prev) => ({
        ...prev,
        error: true,
        message: "Verification code is required",
      }));
      isValid = false;
    } else if (otp.value.length < 6) {
      setOtp((prev) => ({
        ...prev,
        error: true,
        message: "Verification must be at least 6 digits",
      }));
      isValid = false;
    } else {
      setOtp((prev) => ({ ...prev, error: false, message: "" }));
    }

    return !isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateFields()) return;

    setSendRequest(true);

    try {
      const { data } = await AxiosClient.post("/auth/registration/verify", {
        otp: otp.value,
        token,
      });
      localStorage.setItem("token", data.token.access);
      localStorage.setItem("refresh", data.token.refresh);
      navigate("/");
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
            Verify
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
              id="otp"
              type="number"
              label="Verification code"
              name="otp"
              onChange={(e) => setOtp({ ...otp, value: e.target.value })}
              value={otp.value}
              required={true}
              helperText={otp.message}
              error={otp.error}
              autoFocus
              InputLabelProps={{ shrink: true }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Verify
            </Button>

            <Grid container>
              <Grid item xs>
                <Link
                  href="registration"
                  variant="body2"
                  sx={{ textDecoration: "none" }}
                >
                  Back to registration
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
