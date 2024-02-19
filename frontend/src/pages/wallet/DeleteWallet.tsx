import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { Grid, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient, { AxiosError } from "../../utils/axios";
import ErrorMessage from "../../utils/error-message";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import ClearIcon from "@mui/icons-material/Clear";
import PageTitle from "../../components/title/PageTitle";
import CheckIcon from "@mui/icons-material/Check";

export default function DeleteWallet() {
  const nav = useNavigate();
  const params = useParams();

  const [walletName, setWalletName] = useState("");
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });

  const fetchWallet = async () => {
    const result = await AxiosClient.get(`wallets/${params.walletId}`);
    return result.data;
  };

  const deleteHandler = async () => {
    try {
      await AxiosClient.delete(`/wallets/${params.walletId}`);
      nav("/");
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

  const backHandler = () => nav(`/wallets/${params.walletId}/edit`);

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
          <PageTitle title={walletName} />
          Are you sure delete wallet? All <b>transactions</b> will be deleted.
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            size="small"
            sx={{ p: 1, mr: 1 }}
            color="error"
            onClick={deleteHandler}
          >
            <CheckIcon />I confirm to delete wallet
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ p: 1 }}
            onClick={backHandler}
          >
            Back
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
