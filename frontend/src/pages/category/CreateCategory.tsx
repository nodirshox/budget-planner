import React, { useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import PageTitle from "../../components/title/PageTitle";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AxiosClient, { AxiosError } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import LoadingBar from "../../components/loading/LoadingBar";
import { TransactionType } from "../../types/transaction-type";

interface CategoryType {
  id: string;
  name: string;
}

export default function CreateCategory() {
  const navigate = useNavigate();
  const navigateHandler = (path: string) => navigate(path);

  const [alert, setAlert] = useState({ state: false, message: "" });
  const [sendRequest, setSendRequest] = useState(false);
  const [types] = useState<CategoryType[]>([
    {
      id: TransactionType.EXPENSE,
      name: "Expense",
    },
    {
      id: TransactionType.INCOME,
      name: "Income",
    },
  ]);
  const [type, setType] = useState(TransactionType.EXPENSE);

  const handleTypeChange = async (event: any) => {
    setType(event.target.value);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Enter category name"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: { name: string }) => {
    try {
      await AxiosClient.post("/categories", {
        name: data.name,
        type: type,
      });
      navigateHandler("/categories");
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
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <PageTitle title="New category" />
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <InputLabel id="category-label">Name</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={type}
              label="category"
              onChange={handleTypeChange}
              autoWidth
            >
              {types.map((cn, index) => {
                return (
                  <MenuItem key={index} value={cn.id}>
                    {cn.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            id="name"
            label="Name"
            {...register("name")}
            error={errors.name ? true : false}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.name?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigateHandler("/categories")}
            sx={{ ml: 1 }}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12}>
          {alert.state ? (
            <HttpErrorNotification message={alert.message} />
          ) : (
            <></>
          )}
        </Grid>

        {sendRequest ? <LoadingBar /> : <></>}
      </Grid>
    </Paper>
  );
}
