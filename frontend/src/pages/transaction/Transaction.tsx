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
  ListSubheader,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient, { AxiosError } from "../../utils/axios";
import ErrorMessage from "../../utils/error-message";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import { useForm } from "react-hook-form";
import { red, green, grey } from "@mui/material/colors";
import { NumericFormat } from "react-number-format";
import { ICategory } from "../category/Category";

export default function Transaction() {
  const nav = useNavigate();
  const params = useParams();
  const isEditMode = !!params.transactionId;

  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });
  const [expenseCategories, setExpenseCategories] = useState<ICategory[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<ICategory[]>([]);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const { handleSubmit } = useForm();

  const handleChange = (event: any) => {
    setDate(new Date(event.target.value));
  };

  const handleCategoryChange = async (event: any) => {
    setCategory(event.target.value);
  };

  const backHandler = () => nav(`/wallets/${params.walletId}`);

  function formatDate(date: any) {
    const d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  }

  const fetchCategories = async () => {
    const { data } = await AxiosClient.get(`categories`);

    return data;
  };

  const fetchTransaction = async (transactionId: string) => {
    const transaction = await AxiosClient.get(`transactions/${transactionId}`);
    return transaction.data;
  };

  useEffect(() => {
    setSendRequest(true);
    fetchCategories()
      .then(
        (data) => {
          setExpenseCategories(data.expense);
          setIncomeCategories(data.income);
          if (isEditMode) {
            fetchTransaction(params.transactionId!)
              .then((data) => {
                setCategory(data.categoryId);
                setDate(new Date(data.date));
                setAmount(data.amount);
                setNotes(data.notes);
              })
              .catch((error) => {
                const message = ErrorMessage(error);
                setAlert({
                  state: true,
                  message,
                });
              });
          }
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

  const onSubmit = async () => {
    try {
      setSendRequest(true);

      if (isEditMode) {
        await AxiosClient.put(`transactions/${params.transactionId}`, {
          amount: Number(amount),
          walletId: params.walletId,
          categoryId: category,
          date,
          notes,
        });
      } else {
        await AxiosClient.post("transactions", {
          amount: Number(amount),
          walletId: params.walletId,
          categoryId: category,
          date,
          notes,
        });
      }

      nav(`/wallets/${params.walletId}`);
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

  // delete transactions
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    try {
      setSendRequest(true);
      await AxiosClient.delete(`transactions/${params.transactionId}`);
      nav(`/wallets/${params.walletId}`);
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

  return (
    <Paper sx={{ p: 1, mt: 2 }}>
      <Grid
        container
        item
        xs={12}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">Transaction</Typography>

        {isEditMode && (
          <Button variant="outlined" color="error" onClick={handleClickOpen}>
            Delete
          </Button>
        )}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this transaction?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Back</Button>
            <Button onClick={handleDelete} autoFocus color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Grid container spacing={2} direction="row">
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Grid
            container
            alignItems="center"
            spacing={2}
            sx={{ pl: 2, mr: 2, mt: 1 }}
          >
            <Grid item xs={12}>
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
                  required
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
                  {expenseCategories.map((cn, index) => (
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
            <Grid item xs={12}>
              <NumericFormat
                thousandSeparator
                customInput={TextField}
                value={amount}
                onValueChange={(values) => setAmount(values.value)}
                allowNegative={false}
                decimalScale={2}
                required
                fullWidth
                id="amount"
                label="Amount"
                InputLabelProps={{ shrink: true }}
                type="tel"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="notes"
                label="Notes"
                value={notes}
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={(event) => setNotes(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="date"
                value={formatDate(date)}
                onChange={handleChange}
                className="mui-style-date-input"
                max={formatDate(new Date())}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
              >
                {isEditMode ? "Save Transaction" : "Add Transaction"}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={backHandler}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        </form>
        <Grid item xs={12}>
          {alert.state && <HttpErrorNotification message={alert.message} />}
          {sendRequest && <LoadingBar />}
        </Grid>
      </Grid>
    </Paper>
  );
}
