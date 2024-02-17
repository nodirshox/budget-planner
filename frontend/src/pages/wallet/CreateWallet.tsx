import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AxiosClient, { AxiosError } from "../../utils/axios";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import PageTitle from "../../components/title/PageTitle";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface Currency {
  id: string;
  name: string;
}

export default function CreateWallet() {
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currency, setCurrency] = useState("");
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Enter wallet name"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: { title: string }) => {
    try {
      await AxiosClient.post("/wallets", {
        name: data.title,
        currencyId: currency,
      });
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError;
      setSendRequest(false);
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unknown error";

      setAlert({
        state: true,
        message: errorMessage,
      });
      setSendRequest(false);
    }
  };

  const handleCurrencyChange = async (event: any) => {
    setCurrency(event.target.value);
  };

  const fetchCurrency = async () => {
    const result = await AxiosClient.get(`/currencies`);
    return result.data.currencies;
  };

  useEffect(() => {
    fetchCurrency().then(
      (data) => {
        setCurrencies(data);

        if (data.length > 0) {
          setCurrency(data[0].id);
        } else {
          setAlert({
            state: true,
            message: "Currency not found",
          });
        }
      },
      (error) => {
        const axiosError = error as AxiosError;
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Unknown error";
        setAlert({
          state: true,
          message: errorMessage,
        });
      }
    );
  }, []);

  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <PageTitle title="New wallet" />
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <InputLabel id="currency-label">Currency</InputLabel>
            <Select
              labelId="currency-label"
              id="currency"
              value={currency}
              label="Currency"
              onChange={handleCurrencyChange}
              autoWidth
            >
              {currencies.map((cn, index) => {
                return (
                  <MenuItem key={index} value={cn.id}>
                    {cn.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            id="title"
            label="Name"
            {...register("title")}
            error={errors.title ? true : false}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.title?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </Grid>
        <Grid item xs={12}>
          {alert.state ? (
            <HttpErrorNotification message={alert.message} />
          ) : (
            <></>
          )}
        </Grid>

        {sendRequest ? <LoadingBar /> : <></>}
      </Grid>
    </Paper>
  );
}
