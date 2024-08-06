import React, { useState } from "react";
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AxiosClient, { AxiosError } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";

const theme = createTheme();

export default function Registration() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState({
    value: "",
    error: false,
    message: "",
  });
  const [lastName, setLastName] = useState({
    value: "",
    error: false,
    message: "",
  });
  const [email, setEmail] = useState({
    value: "",
    error: false,
    message: "",
  });
  const [password, setPassword] = useState({
    value: "",
    message: "",
    error: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const [alert, setAlert] = useState({ state: false, message: "" });
  const [sendRequest, setSendRequest] = useState(false);

  const validateFields = () => {
    let isValid = true;

    if (!firstName.value) {
      setFirstName((prev) => ({
        ...prev,
        error: true,
        message: "First Name is required",
      }));
      isValid = false;
    } else {
      setFirstName((prev) => ({ ...prev, error: false, message: "" }));
    }

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

    if (!password.value) {
      setPassword((prev) => ({
        ...prev,
        error: true,
        message: "Password is required",
      }));
      isValid = false;
    } else if (password.value.length < 6) {
      setPassword((prev) => ({
        ...prev,
        error: true,
        message: "Password must be at least 6 characters long",
      }));
      isValid = false;
    } else {
      setPassword((prev) => ({ ...prev, error: false, message: "" }));
    }

    return !isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateFields()) return;

    setSendRequest(true);

    try {
      const { data } = await AxiosClient.post("/auth/registration", {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      });
      navigate(`/verify?token=${data.token}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      setSendRequest(false);
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unknown error";

      if (
        ["User exists with this email"].some((e) => errorMessage.includes(e))
      ) {
        setAlert({ state: true, message: "User exists with this email" });
      } else {
        setAlert({ state: true, message: errorMessage });
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  onChange={(e) =>
                    setFirstName({ ...firstName, value: e.target.value })
                  }
                  value={firstName.value}
                  required={true}
                  helperText={firstName.message}
                  error={firstName.error}
                  autoFocus
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(e) =>
                    setLastName({ ...lastName, value: e.target.value })
                  }
                  value={lastName.value}
                  required={true}
                  helperText={lastName.message}
                  error={lastName.error}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  onChange={(e) =>
                    setEmail({ ...email, value: e.target.value })
                  }
                  value={email.value}
                  required={true}
                  helperText={email.message}
                  error={email.error}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) =>
                    setPassword({ ...password, value: e.target.value })
                  }
                  value={password.value}
                  required={true}
                  helperText={password.message}
                  error={password.error}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create account
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="login"
                  variant="body2"
                  sx={{ textDecoration: "none" }}
                >
                  Already have an account? Sign in
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
