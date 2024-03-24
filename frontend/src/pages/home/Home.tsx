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
import { red, green } from "@mui/material/colors";
import { Wealth } from "./Wealth";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import SettingsIcon from "@mui/icons-material/Settings";

interface IWallet {
  id: string;
  name: string;
  amount: number;
  currency: {
    name: string;
  };
}

export default function Home() {
  const nav = useNavigate();

  const [showWealth, setShowWealth] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });
  const [usd, setUsd] = useState(0);
  const [uzs, setUzs] = useState(0);

  const fetchUserInformation = async () => {
    const result = await AxiosClient.get("wallets");
    const wallets = result.data.wallets.map((wallet: any) => {
      return {
        ...wallet,
        amount: wallet.amount / 100,
      };
    });
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
          setUserId(data.user.id);
          setWallets(data.wallets);

          data.wallets.forEach((wallet: IWallet) => {
            if (wallet.currency.name === "UZS") {
              setUzs(wallet.amount);
            } else if (wallet.currency.name === "USD") {
              setUsd(wallet.amount);
            }
          });
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

  const formatAmount = (wallet: IWallet) => {
    const numberFormat = new Intl.NumberFormat("en-US", {
      currency: wallet.currency.name,
    });
    let number = numberFormat.format(wallet.amount);

    if (wallet.amount > 0) {
      number = `+${number} ${wallet.currency.name}`;
    } else {
      number = `${number} ${wallet.currency.name}`;
    }

    return (
      <Typography
        style={{
          color: wallet.amount < 0 ? red[500] : green[500],
        }}
        sx={{ fontWeight: 500 }}
        variant="subtitle1"
        component="div"
      >
        {number}
      </Typography>
    );
  };
  const toggleWealthVisibility = () => {
    setShowWealth(!showWealth);
  };

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
              onClick={toggleWealthVisibility}
              size="small"
              sx={{ mr: 1, ml: 1, p: 1 }}
            >
              <AttachMoneyOutlinedIcon />
              {showWealth ? "Hide" : "Check"}
            </Button>
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
        {showWealth && (
          <Grid item xs={12}>
            <Wealth usd={usd} uzs={uzs} userId={userId} />
          </Grid>
        )}
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
                          {formatAmount(wallet)}
                        </CardContent>
                      </Link>
                    </Card>
                  </Grid>
                ))}
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
