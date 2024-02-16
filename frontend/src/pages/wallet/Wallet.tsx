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
import { useNavigate } from "react-router-dom";
import walletImage from "../../assets/wallet.jpg";
import { Link } from "react-router-dom";
import AxiosClient from "../../utils/axios";
import ErrorMessage from "../../utils/error-message";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";

interface IWallet {
  id: string;
  name: string;
  currency: string;
}

export default function Wallet() {
  const nav = useNavigate();

  const [fullName, setFullName] = useState("");
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });

  const fetchUserInformation = async () => {
    const result = await AxiosClient.get("wallets");
    return result.data;
  };

  const logoutHandler = () => nav(`/logout`);

  useEffect(() => {
    setSendRequest(true);
    fetchUserInformation()
      .then(
        (data) => {
          setFullName(`${data.user.firstName} ${data.user.lastName}`);
          setWallets(
            data.wallets.map((w: any) => {
              return {
                id: w.id,
                name: w.name,
                currency: w.currency.name,
              };
            })
          );
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
          {fullName}
          <Button onClick={logoutHandler}>Chiqish</Button>
        </Grid>

        {wallets.map((wallet, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <Link to={`/wallet/${wallet.id}`}>
                <CardContent>
                  <CardMedia
                    component="img"
                    height="200"
                    image={walletImage}
                    alt="Wallet"
                  />
                  <Typography variant="h6" component="div">
                    {wallet.name} - {wallet.currency}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12}>
          {alert.state && <HttpErrorNotification message={alert.message} />}
          {sendRequest && <LoadingBar />}
        </Grid>
      </Grid>
    </Paper>
  );
}
