import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient from "../../utils/axios";
import ErrorMessage from "../../utils/error-message";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import ClearIcon from "@mui/icons-material/Clear";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

interface IWallet {
  id: string;
  name: string;
  currency: string;
}

export default function Wallet() {
  const nav = useNavigate();
  const params = useParams();

  const [walletName, setWalletName] = useState("");
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });

  const fetchWallet = async () => {
    const result = await AxiosClient.get(`wallets/${params.walletId}`);
    return result.data;
  };

  const deleteHandler = () => nav(`/wallets/${params.walletId}/delete`);
  const editHandler = () => nav(`/wallets/${params.walletId}/edit`);

  useEffect(() => {
    setSendRequest(true);
    fetchWallet()
      .then(
        (data) => {
          setWalletName(data.name);
        },
        (error) => {
          const message = ErrorMessage(error);
          setAlert({
            state: true,
            message,
          });
        }
      )
      .then(() => setSendRequest(false));
  }, []);

  return (
    <Paper sx={{ p: 1, mt: 2 }}>
      <Grid container spacing={2} direction="row">
        <Grid item xs={12}>
          {walletName}
          <Button
            variant="contained"
            size="small"
            sx={{ mr: 1, ml: 1, p: 1 }}
            onClick={editHandler}
          >
            <ModeEditIcon />
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ p: 1 }}
            onClick={deleteHandler}
          >
            <ClearIcon />
            Delete
          </Button>
        </Grid>

        <Grid item xs={12}>
          {alert.state && <HttpErrorNotification message={alert.message} />}
          {sendRequest && <LoadingBar />}
        </Grid>
      </Grid>
    </Paper>
  );
}
