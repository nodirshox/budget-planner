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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient, { AxiosError } from "../../utils/axios";
import ErrorMessage from "../../utils/error-message";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import ClearIcon from "@mui/icons-material/Clear";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface ICategory {
  id: string;
  name: string;
}

interface FormData {
  amount: number;
}

export default function Wallet() {
  const nav = useNavigate();
  const params = useParams();

  const [walletName, setWalletName] = useState("");
  const [currency, setCurrency] = useState("");
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [category, setCategory] = useState("");

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .positive("Enter positive number")
      .typeError("Enter amount")
      .required("Enter amount"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const fetchWallet = async () => {
    const wallet = await AxiosClient.get(`wallets/${params.walletId}`);

    const categories = await AxiosClient.get(`/categories`);

    return { wallet: wallet.data, categories: categories.data.categories };
  };

  const handleCategoryChange = async (event: any) => {
    setCategory(event.target.value);
  };

  const deleteHandler = () => nav(`/wallets/${params.walletId}/delete`);
  const editHandler = () => nav(`/wallets/${params.walletId}/edit`);

  useEffect(() => {
    setSendRequest(true);
    fetchWallet()
      .then(
        (data) => {
          setWalletName(data.wallet.name);
          setCurrency(data.wallet.currency.name);
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setCategory(data.categories[0].id);
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
      .then(() => setSendRequest(false));
  }, []);

  const onSubmit = async ({ amount }: FormData) => {
    try {
      await AxiosClient.post("/transaction", {
        amount,
        categoryId: category,
        walletId: params.walletId,
      });
      nav(`/wallets/${params.walletId}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      setSendRequest(false);
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
            <Button
              variant="outlined"
              size="small"
              sx={{ p: 1 }}
              onClick={deleteHandler}
            >
              <ClearIcon />
              Delete
            </Button>
          </div>
        </Grid>

        <Grid item xs={12}>
          0 {currency}
        </Grid>

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
              >
                {categories.map((cn, index) => (
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
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {alert.state && <HttpErrorNotification message={alert.message} />}
          {sendRequest && <LoadingBar />}
        </Grid>
      </Grid>
    </Paper>
  );
}
