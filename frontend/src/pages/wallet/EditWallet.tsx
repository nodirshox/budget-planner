import React, { useState, useEffect } from "react";
import { Paper, Grid, TextField, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient, { AxiosError } from "../../utils/axios";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Calculator } from "./Calculator";
import Divider from "@mui/material/Divider";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

interface Currency {
  id: string;
  name: string;
}

export default function EditWallet() {
  const navigate = useNavigate();
  const params = useParams();
  const [currency, setCurrency] = useState("");
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });
  const [walletAmount, setWalletAmount] = useState(0);
  const [userId, setUserId] = useState("");

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

  const fetchCurrency = async () => {
    const wallet = await AxiosClient.get(`/wallets/${params.walletId}`);

    return { wallet: wallet.data };
  };

  useEffect(() => {
    fetchCurrency().then(
      (data) => {
        setCurrency(data.wallet.currency.name);
        setWalletAmount(data.wallet.amount);
        setUserId(data.wallet.userId);
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
            onClick={backHandler}
            size="small"
            sx={{ p: 1 }}
          >
            <ArrowBackIosIcon />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Calculator
            totalAmount={walletAmount}
            currency={currency}
            userId={userId}
          />
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} style={{ width: "100%" }} />
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
            Save
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 1 }}
            onClick={deleteHandler}
            color="error"
          >
            Delete wallet
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
