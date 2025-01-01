import React, { useState, useEffect, useRef } from "react";
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
  Fab,
} from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AxiosClient from "../../utils/axios";
import ErrorMessage from "../../utils/error-message";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { red, green, grey } from "@mui/material/colors";
import PaidIcon from "@mui/icons-material/Paid";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import HomeIcon from "@mui/icons-material/Home";
import { superUserId } from "../../utils/super-user";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";

import { formatNumberWithSeparator } from "../../utils/number-formatter";
import TransactionAmount from "../../components/amount/TransactionAmount";
import { formatMonth } from "../../utils/format-month";
import { ITransaction } from "../../types/transaction";
import { CurrencyType } from "../../types/currency";

export const formatDayTotal = (amount: number, currency: string) => {
  let number = formatNumberWithSeparator(amount);

  number = `${number} ${currency}`;

  return (
    <Typography
      component="span"
      style={{
        color: grey[500],
      }}
      sx={{ fontWeight: 400 }}
    >
      {number}
    </Typography>
  );
};

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

  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const params = useParams();

  const [walletName, setWalletName] = useState("");
  const [walletAmount, setWalletAmount] = useState(0);
  const [currency, setCurrency] = useState(CurrencyType.USD);
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [categoryId] = useState(searchParams.get("categoryId"));
  const listRef = useRef<HTMLUListElement | null>(null);
  const [userId, setUserId] = useState<string>("");

  const monthParam = searchParams.get("month");
  let date = new Date();
  if (monthParam) {
    date = new Date(monthParam);
  }

  const [month, setMonth] = useState(date);

  const fetchTransactions = async () => {
    const { data } = await AxiosClient.post("transactions/filter", {
      walletId: params.walletId,
      month,
      ...(categoryId && {
        categoryId,
      }),
    });

    return data;
  };

  const navigateHandler = (path: string) => nav(path);
  const editHandler = () => nav(`/wallets/${params.walletId}/edit`);
  const backHandler = () => nav(`/home`);
  const overviewHandler = () => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const monthDate = `${monthIndex + 1}`.padStart(2, "0");

    const firstDay = `${year}-${monthDate}-01`;

    const lastDay = `${year}-${monthDate}-${new Date(
      year,
      monthIndex + 1,
      0
    ).getDate()}`;

    nav(
      `/wallets/${params.walletId}/overview?startDate=${firstDay}&endDate=${lastDay}`
    );
  };
  const addTransactionHandler = () =>
    nav(`/wallets/${params.walletId}/transactions`);

  const transactionHandler = (id: string) =>
    nav(`/wallets/${params.walletId}/transactions/${id}`);

  useEffect(() => {
    setSendRequest(true);
    fetchTransactions()
      .then(
        (data) => {
          setWalletName(data.wallet.name);
          setWalletAmount(data.wallet.amount);
          setCurrency(data.wallet.currency.name);
          setTransactions(data.transactions);
          setUserId(data.wallet.userId);
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
    let number = formatNumberWithSeparator(walletAmount);

    number = `${number} ${currency}`;

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

  const handleMonthChange = (event: any) => {
    setMonth(new Date(event.target.value));
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
            {userId === superUserId && currency === CurrencyType.UZS && (
              <Button
                variant="outlined"
                size="small"
                sx={{ ml: 1, p: 1 }}
                onClick={() =>
                  navigateHandler(`/wallets/${params.walletId}/click`)
                }
              >
                Click
              </Button>
            )}

            <Button
              variant="outlined"
              size="small"
              sx={{ ml: 1, p: 1 }}
              onClick={editHandler}
            >
              <ModeEditIcon />
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: 1, p: 1 }}
              onClick={backHandler}
            >
              <HomeIcon />
            </Button>
          </div>
        </Grid>

        <Grid container item xs={12} alignItems="center">
          {formatwalletAmount()}
          <Button sx={{ mr: 0, p: 0 }} onClick={overviewHandler}>
            <AutoGraphIcon />
          </Button>
        </Grid>

        <Grid item xs={12}>
          <input
            type="month"
            value={formatMonth(month)}
            onChange={handleMonthChange}
            className="mui-style-date-input"
            max={formatMonth(new Date())}
            onKeyDown={(e) => e.preventDefault()}
          />
        </Grid>
        <Grid item xs={12}>
          <List sx={{ maxHeight: maxHeight, overflowY: "auto" }} ref={listRef}>
            {transactions.map((group, groupIndex) => (
              <li key={`section-${groupIndex}`}>
                <ul>
                  <ListItem style={{ background: "#EEEEEE", color: "#5D6E7B" }}>
                    <ListItemText primary={formatDate(group.day)} />
                    <ListItemSecondaryAction>
                      {formatDayTotal(group.total, currency)}
                    </ListItemSecondaryAction>
                  </ListItem>
                  {group.transactions.map((transaction, trnasactionIndex) => (
                    <ListItem
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      key={`${groupIndex}-${trnasactionIndex}`}
                      onClick={() => transactionHandler(transaction.id)}
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
                      <ListItemSecondaryAction
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={() => transactionHandler(transaction.id)}
                      >
                        <TransactionAmount
                          amount={transaction.amount}
                          type={transaction.type}
                          currency={currency}
                        />
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

      <Fab
        color="primary"
        aria-label="add"
        onClick={addTransactionHandler}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
    </Paper>
  );
}
