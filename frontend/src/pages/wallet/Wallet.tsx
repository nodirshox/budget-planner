import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import {
  Grid,
  FormControl,
  Typography,
  Button,
  Select,
  TextField,
  InputLabel,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient, { AxiosError } from "../../utils/axios";
import ErrorMessage from "../../utils/error-message";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { red, green, grey } from "@mui/material/colors";
import PaidIcon from "@mui/icons-material/Paid";

interface ICategory {
  id: string;
  name: string;
}

interface ITransaction {
  id: string;
  amount: number;
  type: string;
  category: {
    name: true;
  };
}

export default function Wallet() {
  const nav = useNavigate();
  const params = useParams();

  const [walletName, setWalletName] = useState("");
  const [currency, setCurrency] = useState("");
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });
  const [expenceCategories, setExpenceCategories] = useState<ICategory[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<ICategory[]>([]);
  const [category, setCategory] = useState("");
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .positive("Enter positive number")
      .typeError("Enter only number")
      .required("Enter amount"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },

    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const fetchTransactions = async () => {
    const transactions = await AxiosClient.post("transactions/filter", {
      walletId: params.walletId,
    });

    const categories = await AxiosClient.get(`categories`);

    return {
      wallet: transactions.data.wallet,
      transactions: transactions.data.transactions,
      categories: categories.data,
    };
  };

  const handleCategoryChange = async (event: any) => {
    setCategory(event.target.value);
  };

  const editHandler = () => nav(`/wallets/${params.walletId}/edit`);

  useEffect(() => {
    setSendRequest(true);
    fetchTransactions()
      .then(
        (data) => {
          setWalletName(data.wallet.name);
          setCurrency(data.wallet.currency.name);
          setTransactions(data.transactions);
          setExpenceCategories(data.categories.expence);
          setIncomeCategories(data.categories.income);
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

  const onSubmit = async (data: { amount: number }) => {
    try {
      setSendRequest(true);
      const newTransaction = await AxiosClient.post("transactions", {
        amount: data.amount,
        walletId: params.walletId,
        categoryId: category,
      });
      setTransactions([
        {
          id: newTransaction.data.id,
          amount: data.amount,
          type: newTransaction.data.category.type,
          category: {
            name: newTransaction.data.category.name,
          },
        },
        ...transactions,
      ]);
      setCategory("");
      reset();
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unknown error";

      setAlert({
        state: true,
        message: errorMessage,
      });
    } finally {
      setSendRequest(false);
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const currency = "USD";
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
              Edit
            </Button>
          </div>
        </Grid>

        <Grid item xs={12}>
          0 {currency}
        </Grid>

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Grid
            container
            alignItems="center"
            spacing={2}
            sx={{ pl: 2, mr: 2, mt: 1 }}
          >
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  value={category}
                  label="Category"
                  onChange={handleCategoryChange}
                  autoWidth
                  displayEmpty
                >
                  <ListSubheader
                    sx={{
                      fontSize: "0.875rem",
                      color: grey[50],
                      backgroundColor: red[500],
                    }}
                  >
                    Expenses
                  </ListSubheader>
                  {expenceCategories.map((cn, index) => (
                    <MenuItem key={index} value={cn.id}>
                      {cn.name}
                    </MenuItem>
                  ))}
                  <ListSubheader
                    sx={{
                      fontSize: "0.875rem",
                      color: grey[50],
                      backgroundColor: green[500],
                    }}
                  >
                    Income
                  </ListSubheader>
                  {incomeCategories.map((cn, index) => (
                    <MenuItem key={index} value={cn.id}>
                      {cn.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                id="amount"
                label="Amount"
                type="number"
                {...register("amount")}
                defaultValue=""
                error={errors.amount ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.amount?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
        <Grid item xs={12}>
          <List>
            {transactions.map((transaction) => (
              <ListItem
                key={transaction.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                  display: "flex",
                  alignItems: "center",
                }}
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
                />
                <ListItemSecondaryAction>
                  {formatAmount(transaction.amount, transaction.type)}
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
