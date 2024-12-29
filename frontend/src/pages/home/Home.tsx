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
import { Wealth } from "./Wealth";
import SettingsIcon from "@mui/icons-material/Settings";
import { IWallet } from "./types/wallet";
import WalletAmount from "../../components/amount/WalletAmount";

export default function Home() {
  const nav = useNavigate();

  const [fullName, setFullName] = useState("");
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });

  const fetchUserInformation = async () => {
    const result = await AxiosClient.get("wallets");
    const wallets = result.data.wallets;
    return {
      ...result.data,
      wallets,
    };
  };

  const settingsHandler = () => nav(`/settings`);

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
        <Grid
          item
          container
          xs={12}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{fullName}</Typography>
          <div>
            <Button
              variant="outlined"
              onClick={settingsHandler}
              size="small"
              sx={{ p: 1 }}
            >
              <SettingsIcon />
            </Button>
          </div>
        </Grid>

        {sendRequest ? (
          <Grid item xs={12}>
            <LoadingBar />
          </Grid>
        ) : (
          <>
            {wallets.length > 0 ? (
              <>
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
                          <WalletAmount
                            amount={wallet.amount}
                            currency={wallet.currency.name}
                          />
                        </CardContent>
                      </Link>
                    </Card>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Wealth wallets={wallets} />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Typography variant="subtitle1" component="div">
                  To create new wallet, go to <b>"Settings"</b> page.
                </Typography>
              </Grid>
            )}
          </>
        )}

        <Grid item xs={12}>
          {alert.state && <HttpErrorNotification message={alert.message} />}
        </Grid>
      </Grid>
    </Paper>
  );
}
