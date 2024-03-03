import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AxiosClient from "../../utils/axios";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { red, green } from "@mui/material/colors";
import LoadingBar from "../../components/loading/LoadingBar";
import Divider from "@mui/material/Divider";

export interface ICategory {
  id: string;
  name: string;
  type: string;
  transactionsCount: number;
}

export default function Category() {
  const nav = useNavigate();
  const [sendRequest, setSendRequest] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const navigateHandler = (path: string) => nav(path);

  const fetchCategories = async () => {
    const { data } = await AxiosClient.get("categories");
    return data;
  };

  useEffect(() => {
    setSendRequest(true);
    fetchCategories()
      .then((data) => {
        setExpenses(data.expense);
        setIncomes(data.income);
      })
      .then(() => setSendRequest(false));
  }, []);

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
          <Typography variant="h6">Categories</Typography>
          <div>
            <Button
              variant="outlined"
              onClick={() => navigateHandler("/categories/create")}
              size="small"
              sx={{ p: 1, mr: 1 }}
            >
              <AddIcon />
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigateHandler("/settings")}
              size="small"
              sx={{ p: 1 }}
            >
              <ArrowBackIosIcon />
            </Button>
          </div>
        </Grid>
      </Grid>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Grid item xs={12} sx={{ color: red[500] }}>
        <b>Expenses</b>
      </Grid>
      <Grid item xs={12}>
        <List dense disablePadding>
          {expenses.map((category: ICategory, index) => (
            <ListItem key={index}>
              <ListItemText>
                <ListItemText primary={category.name} />
              </ListItemText>
              <IconButton
                size="small"
                aria-label="edit"
                onClick={() =>
                  navigateHandler(`/categories/${category.id}/edit`)
                }
              >
                <EditIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Grid item xs={12} sx={{ color: green[500] }}>
        <b>Income</b>
      </Grid>
      <Grid item xs={12}>
        <List dense disablePadding>
          {incomes.map((category: ICategory, index) => (
            <ListItem key={index}>
              <ListItemText>
                <ListItemText primary={category.name} />
              </ListItemText>
              <IconButton
                size="small"
                aria-label="edit"
                onClick={() =>
                  navigateHandler(`/categories/${category.id}/edit`)
                }
              >
                <EditIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        {sendRequest ? <LoadingBar /> : <></>}
      </Grid>
    </Paper>
  );
}
