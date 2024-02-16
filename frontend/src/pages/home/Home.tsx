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
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from "@mui/icons-material/Add";

interface IWallet {
  id: string;
  name: string;
  currency: {
    name: string;
  };
}

export default function Home() {
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
  const createHandler = () => nav(`/wallets/create`);

  useEffect(() => {
    setSendRequest(true);
    fetchUserInformation()
      .then(
        (data) => {
          setFullName(`${data.user.firstName} ${data.user.lastName}`);
          setWallets(data.wallets);
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
          <Button
            variant="contained"
            onClick={createHandler}
            sx={{ mr: 1, ml: 1, p: 1 }}
            size="small"
          >
            <AddIcon /> Yaratish
          </Button>
          <Button
            variant="contained"
            onClick={logoutHandler}
            size="small"
            sx={{ p: 1 }}
          >
            <ExitToAppIcon />
            Chiqish
          </Button>
        </Grid>
        {wallets.map((wallet, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <Link to={`/wallets/${wallet.id}`}>
                <CardContent>
                  <CardMedia
                    component="img"
                    height="200"
                    image={walletImage}
                    alt="Wallet"
                  />
                  <Typography variant="h6" component="div">
                    {wallet.name}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    {wallet.currency.name}
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
