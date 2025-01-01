import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AxiosClient from "../../utils/axios";
import ChartDataLabels from "chartjs-plugin-datalabels";
import PaidIcon from "@mui/icons-material/Paid";
import LoadingBar from "../../components/loading/LoadingBar";

import TransactionAmount from "../../components/amount/TransactionAmount";
import { TransactionType } from "../../types/transaction-type";
import { CurrencyType } from "../../types/currency";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface IOverview {
  total: number;
  transactions: number;
  categoryId: string;
  categoryName: string;
}

export default function Overview() {
  const nav = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigationHandler = (path: string) => nav(path);

  const [categories, setCategories] = useState<IOverview[]>([]);
  const [backgroundColors, setBackgroundColors] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [transactionType, setTransactionType] = useState(
    TransactionType.EXPENSE
  );
  const [currency, setCurrency] = useState(CurrencyType.USD);
  const [sendRequest, setSendRequest] = useState(false);

  const [startDate, setStartDate] = useState<string>(
    searchParams.get("startDate") || new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    searchParams.get("endDate") || new Date().toISOString().split("T")[0]
  );

  const handleChange = (event: any) => {
    setTransactionType(event.target.value as TransactionType);
  };

  const generateBackgroundColor = (length: number) => {
    const colors = [];
    for (let i = 0; i < length; i++) {
      const randomColor = `rgba(${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, 0.75)`;
      colors.push(randomColor);
    }
    return colors;
  };

  const fetchOverview = async () => {
    const { data } = await AxiosClient.put(
      `wallets/${params.walletId}/overview`,
      {
        categoryType: transactionType,
        startDate,
        endDate,
      }
    );
    setCategories(data.overview);
    setBackgroundColors(generateBackgroundColor(data.overview.length));
    setTotal(data.total);
    setCurrency(data.wallet.currency.name);
    return data;
  };

  const handleConfirmDateChange = () => {
    setSendRequest(true);
    fetchOverview()
      .then((data) => {})
      .finally(() => setSendRequest(false));
  };

  useEffect(() => {
    setSendRequest(true);
    fetchOverview()
      .then((data) => {})
      .finally(() => setSendRequest(false));
  }, [transactionType]);

  const data = {
    labels: categories.map((ov: any) => ov.categoryName),
    datasets: [
      {
        data: categories.map((ov: any) => ov.total),
        backgroundColor: backgroundColors,
        datalabels: {
          color: "#fff",
          formatter: (value: number) => {
            let percentage = ((value * 100) / total).toFixed(1) + "%";
            return percentage;
          },
        },
      },
    ],
  };

  const setText = (transactions: number): string => {
    let text = `transaction`;

    if (transactions > 1) {
      text = `${text}s`;
    }

    return `${transactions} ${text}`;
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
          <Typography variant="h6">Overview</Typography>
          <div>
            <Button
              variant="outlined"
              onClick={() => navigationHandler(`/wallets/${params.walletId}`)}
              size="small"
              sx={{ p: 1 }}
            >
              <ArrowBackIosIcon />
            </Button>
          </div>
        </Grid>

        <Grid item xs={12}>
          Total
          <br />
          <TransactionAmount
            amount={total}
            type={transactionType}
            currency={currency}
          />
        </Grid>

        {sendRequest && (
          <Grid item xs={12}>
            <LoadingBar />
          </Grid>
        )}

        <Grid item xs={6}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={transactionType}
              label="Type"
              onChange={handleChange}
            >
              <MenuItem value={TransactionType.EXPENSE}>Expense</MenuItem>
              <MenuItem value={TransactionType.INCOME}>Income</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmDateChange}
            fullWidth
          >
            Apply Dates
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Doughnut data={data} />
        </Grid>
      </Grid>

      <Divider />
      <Grid item xs={12}>
        <List>
          {categories.map((category, index) => (
            <ListItem
              key={index}
              sx={{ cursor: "pointer" }}
              onClick={() =>
                navigationHandler(
                  `/wallets/${params.walletId}?categoryId=${category.categoryId}&startDate=${startDate}&endDate=${endDate}`
                )
              }
            >
              <ListItemIcon>
                <PaidIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={category.categoryName}
                secondary={setText(category.transactions)}
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
                <TransactionAmount
                  amount={category.total}
                  type={transactionType}
                  currency={currency}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Paper>
  );
}
