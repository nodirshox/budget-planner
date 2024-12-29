import {
  Paper,
  Grid,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate, useParams } from "react-router-dom";
import PaidIcon from "@mui/icons-material/Paid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ErrorMessage from "../../utils/error-message";
import AxiosClient from "../../utils/axios";

import TransactionAmount from "../../components/amount/TransactionAmount";
import { formatMonth } from "../../utils/format-month";
import { CurrencyType } from "../../types/currency";

interface IClickTransaction {
  amount: number;
  createdAt: Date;
  description: string;
  type: string;
}

export default function ClickTransactions() {
  const nav = useNavigate();
  const navigateHandler = (path: string) => nav(path);
  const [month, setMonth] = useState(new Date());
  const [currency] = useState(CurrencyType.UZS);
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });
  const [transactions, setTransactions] = useState<IClickTransaction[]>([]);
  const params = useParams();

  const theme = useTheme();
  const listRef = useRef<HTMLUListElement | null>(null);

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

  const handleMonthChange = (event: any) => {
    setMonth(new Date(event.target.value));
  };
  function formatCreatedAt(date: Date) {
    const year = date.getFullYear();
    const month = "" + (date.getMonth() + 1);
    const day = "" + date.getDate();
    return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
  }

  const fetchTransactions = async () => {
    const { data } = await AxiosClient.post("transactions/click", {
      month,
    });

    return data.transactions;
  };

  useEffect(() => {
    setSendRequest(true);
    fetchTransactions()
      .then(
        (data) => {
          setTransactions(data);
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

    // scroll to the top when month changes
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [month]);

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
          <Typography variant="h6">Click transactions</Typography>
          <div>
            <Button
              variant="outlined"
              onClick={() => navigateHandler(`/wallets/${params.walletId}`)}
              size="small"
              sx={{ p: 1 }}
            >
              <ArrowBackIosIcon />
            </Button>
          </div>
        </Grid>

        <Grid item xs={12}>
          <input
            type="month"
            value={formatMonth(month)}
            onChange={handleMonthChange}
            className="mui-style-date-input"
            max={formatMonth(new Date())}
          />
        </Grid>

        <Divider />
        <Grid item xs={12}>
          <List sx={{ maxHeight: maxHeight, overflowY: "auto" }} ref={listRef}>
            {transactions.map((transaction, transactionIndex) => (
              <ListItem
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                key={transactionIndex}
              >
                <ListItemIcon>
                  <PaidIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={transaction.description}
                  sx={{
                    ".MuiListItemText-multiline": {
                      maxWidth: "60%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                  secondary={formatCreatedAt(new Date(transaction.createdAt))}
                  onClick={() =>
                    navigateHandler(
                      `/wallets/${params.walletId}/transactions?amount=${transaction.amount}&redirect=click`
                    )
                  }
                />
                <ListItemSecondaryAction
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <TransactionAmount
                    amount={transaction.amount}
                    type={transaction.type}
                    currency={currency}
                  />
                </ListItemSecondaryAction>
              </ListItem>
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
