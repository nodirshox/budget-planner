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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AxiosClient from "../../utils/axios";
import ChartDataLabels from "chartjs-plugin-datalabels";
import PaidIcon from "@mui/icons-material/Paid";
import { formatAmount } from "../wallet/Wallet";
import LoadingBar from "../../components/loading/LoadingBar";

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
  const navigationHandler = (path: string) => nav(path);
  const [categories, setCategories] = useState<IOverview[]>([]);
  const [backgroundColors, setBackgroundColors] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [transactionType, setTransactiontype] = useState("EXPENSE");
  const [currency, setCurrency] = useState("USD");
  const [sendRequest, setSendRequest] = useState(false);

  const handleChange = (event: any) => {
    setTransactiontype(event.target.value as string);
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
        month: new Date(`${params.date}`),
      }
    );
    return {
      ...data,
      total: data.total / 100,
      overview: data.overview.map((ov: any) => {
        return {
          ...ov,
          total: ov.total / 100,
        };
      }),
    };
  };

  useEffect(() => {
    setSendRequest(true);
    fetchOverview()
      .then((data) => {
        setCategories(data.overview);
        setBackgroundColors(generateBackgroundColor(data.overview.length));
        setTotal(data.total);
        setCurrency(data.wallet.currency.name);
      })
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
          {formatAmount(total, transactionType, currency)}
        </Grid>
        <Grid item xs={12}>
          {sendRequest && <LoadingBar />}
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={transactionType}
              label="Type"
              onChange={handleChange}
            >
              <MenuItem value={"EXPENSE"}>Expense</MenuItem>
              <MenuItem value={"INCOME"}>Income</MenuItem>
            </Select>
          </FormControl>
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
              onClick={() =>
                navigationHandler(
                  `/wallets/${params.walletId}?categoryId=${category.categoryId}`
                )
              }
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ListItemIcon>
                <PaidIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={category.categoryName}
                sx={{
                  ".MuiListItemText-multiline": {
                    maxWidth: "60%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
                secondary={setText(category.transactions)}
              />
              <ListItemSecondaryAction>
                {formatAmount(category.total, transactionType, currency)}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Paper>
  );
}
