import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  ListSubheader,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient from "../../utils/axios";
import ErrorMessage from "../../utils/error-message";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { red, green } from "@mui/material/colors";
import PaidIcon from "@mui/icons-material/Paid";
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface ITransaction {
  day: Date;
  transactions: GroupTransactions[];
}

interface GroupTransactions {
  id: string;
  amount: number;
  notes: string;
  type: string;
  category: {
    name: true;
  };
}

export default function Wallet() {
  const theme = useTheme();

  const isXSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.up("md"));

  const maxHeight = isXSmall
    ? "150px"
    : isSmall
    ? "300px"
    : isMedium
    ? "450px"
    : "600px";

  const nav = useNavigate();
  const params = useParams();

  const [walletName, setWalletName] = useState("");
  const [walletAmount, setWalletAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  const fetchTransactions = async () => {
    const transactions = await AxiosClient.post("transactions/filter", {
      walletId: params.walletId,
    });

    return {
      wallet: transactions.data.wallet,
      transactions: transactions.data.transactions,
    };
  };

  const editHandler = () => nav(`/wallets/${params.walletId}/edit`);
  const backHandler = () => nav(`/`);
  const addTransactionHandler = () =>
    nav(`/wallets/${params.walletId}/transaction`);

  useEffect(() => {
    setSendRequest(true);
    fetchTransactions()
      .then(
        (data) => {
          setWalletName(data.wallet.name);
          setWalletAmount(data.wallet.amount);
          setCurrency(data.wallet.currency.name);
          setTransactions(data.transactions);
        },
        (error) => {
          const message = ErrorMessage(error);
          setAlert({
            state: true,
            message,
          });
        }
      )
      .finally(() => setSendRequest(false));
  }, []);

  const formatAmount = (amount: number, type: string) => {
    const numberFormat = new Intl.NumberFormat("en-US", {
      currency,
    });
    let number = numberFormat.format(amount);

    if (type === "EXPENSE") {
      number = `-${number} ${currency}`;
    } else {
      number = `+${number} ${currency}`;
    }

    return (
      <Typography
        component="span"
        style={{
          color: type === "EXPENSE" ? red[500] : green[500],
        }}
        sx={{ fontWeight: 500 }}
      >
        {number}
      </Typography>
    );
  };
  const formatDate = (input: Date) => {
    const date = new Date(input);
    const today = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    today.setHours(0, 0, 0, 0);

    if (date.setHours(0, 0, 0, 0) === today.getTime()) {
      return "Today";
    }

    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    return `${month} ${day}`;
  };

  const formatwalletAmount = () => {
    const numberFormat = new Intl.NumberFormat("en-US", {
      currency,
    });
    let number = numberFormat.format(walletAmount);

    if (walletAmount > 0) {
      number = `+${number} ${currency}`;
    } else {
      number = `${number} ${currency}`;
    }

    return (
      <Typography
        style={{
          color: walletAmount < 0 ? red[500] : green[500],
        }}
        sx={{ fontWeight: 500 }}
        variant="subtitle1"
        component="div"
      >
        {number}
      </Typography>
    );
  };

  return (
    <Paper sx={{ p: 1, mt: 2 }}>
      <Grid container spacing={2} direction="row">
        <Grid
          container
          item
          xs={12}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{walletName}</Typography>
          <div>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1, p: 1 }}
              onClick={editHandler}
            >
              <ModeEditIcon />
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1, p: 1 }}
              onClick={backHandler}
            >
              <ArrowBackIosNewIcon />
            </Button>
          </div>
        </Grid>

        <Grid
          container
          item
          xs={12}
          justifyContent="space-between"
          alignItems="center"
        >
          {formatwalletAmount()}
          <div>
            <Button
              variant="contained"
              size="small"
              sx={{ mr: 1, p: 1 }}
              onClick={addTransactionHandler}
            >
              <AddIcon />
            </Button>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Divider />
          <List sx={{ maxHeight: maxHeight, overflowY: "auto" }}>
            {transactions.map((group, groupIndex) => (
              <li key={`section-${groupIndex}`}>
                <ul>
                  <ListItem style={{ background: "#EEEEEE", color: "#5D6E7B" }}>
                    <ListItemText primary={formatDate(group.day)} />
                  </ListItem>
                  {group.transactions.map((transaction, trnasactionIndex) => (
                    <ListItem
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                        display: "flex",
                        alignItems: "center",
                      }}
                      key={`${groupIndex}-${trnasactionIndex}`}
                    >
                      <ListItemIcon>
                        <PaidIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={transaction.category.name}
                        sx={{
                          ".MuiListItemText-multiline": {
                            maxWidth: "60%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                        secondary={transaction.notes}
                      />
                      <ListItemSecondaryAction>
                        {formatAmount(transaction.amount, transaction.type)}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </ul>
              </li>
            ))}
          </List>
        </Grid>

        <Grid item xs={12}>
          {alert.state && <HttpErrorNotification message={alert.message} />}
          {sendRequest && <LoadingBar />}
        </Grid>
      </Grid>
    </Paper>
  );
}
