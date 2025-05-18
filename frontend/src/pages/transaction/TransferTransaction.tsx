import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AxiosClient, { AxiosError } from "../../utils/axios";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import { TransactionType } from "../../types/transaction-type";
import { ICategory } from "../category/Category";
import TransactionAmount from "../../components/amount/TransactionAmount";
import { formatNumberWithSeparator } from "../../utils/number-formatter";

interface Wallet {
  id: string;
  name: string;
  currency: {
    id: string;
    name: string;
  };
}

export default function TransferTransaction() {
  const nav = useNavigate();
  const params = useParams();
  const transactionId = params.transactionId;

  const [transaction, setTransaction] = useState<any>(null);
  const [sourceWallet, setSourceWallet] = useState<Wallet | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [targetWalletId, setTargetWalletId] = useState("");
  const [targetCategoryId, setTargetCategoryId] = useState("");
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });

  // Navigate back to the transaction edit page
  const backHandler = () =>
    nav(`/wallets/${params.walletId}/transactions/${transactionId}`);

  // Handle wallet selection change
  const handleWalletChange = (event: SelectChangeEvent) => {
    setTargetWalletId(event.target.value);
  };

  // Handle category selection change
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setTargetCategoryId(event.target.value);
  };

  // Fetch source wallet to get currency info
  const fetchSourceWallet = async () => {
    try {
      const { data } = await AxiosClient.get(`/wallets/${params.walletId}`);
      return data;
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
      return null;
    }
  };

  // Fetch transaction data
  const fetchTransaction = async () => {
    try {
      const { data } = await AxiosClient.get(`/transactions/${transactionId}`);
      return data;
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
      return null;
    }
  };

  // Fetch all user wallets with matching currency
  const fetchWallets = async (sourceCurrencyId: string) => {
    try {
      const { data } = await AxiosClient.get("/wallets");
      // Return only wallets with the same currency as the source wallet
      return data.wallets.filter(
        (wallet: any) =>
          wallet.currency.id === sourceCurrencyId &&
          wallet.id !== params.walletId
      );
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
      return [];
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await AxiosClient.get("/categories");
      return data;
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
      return { expense: [], income: [] };
    }
  };

  // Handle transfer submission
  const handleTransfer = async () => {
    if (!targetWalletId || !targetCategoryId) {
      setAlert({
        state: true,
        message: "Please select both a wallet and a category",
      });
      return;
    }

    setSendRequest(true);

    try {
      await AxiosClient.post("/transactions/transfer", {
        transactionId,
        targetWalletId,
        targetCategoryId,
      });

      // Navigate to the target wallet page
      nav(`/wallets/${targetWalletId}`);
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
      setSendRequest(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setSendRequest(true);

      // Fetch source wallet to get its currency
      const sourceWalletData = await fetchSourceWallet();
      if (!sourceWalletData) {
        setSendRequest(false);
        return;
      }

      setSourceWallet(sourceWalletData);

      // Fetch transaction details
      const transactionData = await fetchTransaction();
      if (transactionData) {
        setTransaction(transactionData);

        // Fetch all wallets with the same currency
        const matchingWallets = await fetchWallets(
          sourceWalletData.currency.id
        );
        setWallets(matchingWallets);

        // Pre-select the first wallet if available
        if (matchingWallets.length > 0) {
          setTargetWalletId(matchingWallets[0].id);
        }

        // Fetch categories and filter by type and pre-select the current category
        const categoriesData = await fetchCategories();
        if (categoriesData) {
          const relevantCategories =
            transactionData.type === TransactionType.EXPENSE
              ? categoriesData.expense
              : categoriesData.income;
          setCategories(relevantCategories);

          // Pre-select the current category
          setTargetCategoryId(transactionData.categoryId);
        }
      }

      setSendRequest(false);
    };

    loadData();
  }, [transactionId, params.walletId]);

  return (
    <Paper sx={{ p: 1, mt: 1 }}>
      <Grid container spacing={2} direction="row">
        <Grid
          item
          container
          xs={12}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Transfer Transaction</Typography>
        </Grid>

        {transaction && (
          <>
            <Grid item xs={12} sx={{ mt: 0 }}>
              <Typography variant="body1">
                Amount: {formatNumberWithSeparator(transaction.amount)}
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="wallet-select-label">Target wallet</InputLabel>
                <Select
                  labelId="wallet-select-label"
                  id="wallet-select"
                  value={targetWalletId}
                  label="Target Wallet"
                  onChange={handleWalletChange}
                  disabled={wallets.length === 0}
                >
                  {wallets.map((wallet) => (
                    <MenuItem key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {wallets.length === 0 && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  No other wallets with the same currency available for
                  transfer.
                </Alert>
              )}
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">
                  Target category
                </InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={targetCategoryId}
                  label="Target Category"
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleTransfer}
                disabled={
                  !targetWalletId || !targetCategoryId || wallets.length === 0
                }
              >
                Transfer
              </Button>
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button variant="outlined" fullWidth onClick={backHandler}>
                Cancel
              </Button>
            </Grid>
          </>
        )}

        {alert.state && (
          <Grid item xs={12}>
            <HttpErrorNotification message={alert.message} />
          </Grid>
        )}

        {sendRequest && <LoadingBar />}
      </Grid>
    </Paper>
  );
}
