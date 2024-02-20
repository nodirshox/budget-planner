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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient, { AxiosError } from "../../utils/axios";
import ErrorMessage from "../../utils/error-message";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { red, green, grey } from "@mui/material/colors";

interface ICategory {
  id: string;
  name: string;
}

export default function Transaction() {
  const nav = useNavigate();
  const params = useParams();

  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });
  const [expenceCategories, setExpenceCategories] = useState<ICategory[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<ICategory[]>([]);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());

  const isEditMode = !!params.transactionId;

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .positive("Enter positive number")
      .typeError("Enter only number")
      .required("Enter amount"),
    notes: Yup.string().max(100),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

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
    const categories = await AxiosClient.get(`categories`);

    return categories.data;
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
          setExpenceCategories(data.expence);
          setIncomeCategories(data.income);
          if (isEditMode) {
            fetchTransaction(params.transactionId!)
              .then((data) => {
                setCategory(data.categoryId);
                setDate(new Date(data.date));
                setValue("amount", data.amount);
                setValue("notes", data.notes);
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

  const onSubmit = async (data: { amount: number; notes?: string }) => {
    try {
      setSendRequest(true);

      if (isEditMode) {
        await AxiosClient.put(`transactions/${params.transactionId}`, {
          amount: data.amount,
          walletId: params.walletId,
          categoryId: category,
          date,
          notes: data.notes,
        });
      } else {
        await AxiosClient.post("transactions", {
          amount: data.amount,
          walletId: params.walletId,
          categoryId: category,
          date,
          notes: data.notes,
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

  return (
    <Paper sx={{ p: 1, mt: 2 }}>
      <Typography variant="h6">Transaction</Typography>
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

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="amount"
                label="Amount"
                type="number"
                {...register("amount")}
                defaultValue=""
                error={errors.amount ? true : false}
                inputProps={{
                  step: "0.01",
                }}
                InputLabelProps={{ shrink: true }}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.amount?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="notes"
                label="Notes"
                {...register("notes")}
                error={errors.notes ? true : false}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.notes?.message}
              </Typography>
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
