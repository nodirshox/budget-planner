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
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient, { AxiosError } from "../../utils/axios";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";

interface Currency {
  id: string;
  name: string;
}

export default function EditWallet() {
  const navigate = useNavigate();
  const params = useParams();
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
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const deleteHandler = () => navigate(`/wallets/${params.walletId}/delete`);
  const backHandler = () => navigate(`/wallets/${params.walletId}`);

  const onSubmit = async (data: { title: string }) => {
    try {
      await AxiosClient.put(`/wallets/${params.walletId}`, {
        name: data.title,
        currencyId: currency,
      });
      navigate(`/wallets/${params.walletId}`);
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
    const currencies = await AxiosClient.get("/currencies");

    const wallet = await AxiosClient.get(`/wallets/${params.walletId}`);

    return { currencies: currencies.data.currencies, wallet: wallet.data };
  };

  useEffect(() => {
    fetchCurrency().then(
      (data) => {
        setCurrencies(data.currencies);

        if (data.currencies.length > 0) {
          setCurrency(data.currencies[0].id);
        } else {
          setAlert({
            state: true,
            message: "Currency not found",
          });
        }

        setCurrency(data.wallet.currencyId);
        setValue("title", data.wallet.name);
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
        <Grid
          container
          item
          xs={12}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Edit wallet</Typography>

          <Button
            variant="outlined"
            size="small"
            sx={{ p: 1 }}
            onClick={deleteHandler}
            color="error"
          >
            Delete wallet
          </Button>
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
            InputLabelProps={{ shrink: true }}
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
            Update
          </Button>
          <Button variant="outlined" onClick={backHandler} sx={{ ml: 1 }}>
            Back
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
