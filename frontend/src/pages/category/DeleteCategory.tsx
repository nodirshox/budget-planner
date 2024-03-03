import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { Grid, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient, { AxiosError } from "../../utils/axios";
import ErrorMessage from "../../utils/error-message";
import LoadingBar from "../../components/loading/LoadingBar";
import HttpErrorNotification from "../../components/notifications/HttpErrorNotification";
import PageTitle from "../../components/title/PageTitle";
import CheckIcon from "@mui/icons-material/Check";

export default function DeleteCategory() {
  const nav = useNavigate();
  const params = useParams();

  const [categoryName, setCategoryName] = useState("");
  const [sendRequest, setSendRequest] = useState(false);
  const [alert, setAlert] = useState({ state: false, message: "" });

  const fetchCategory = async () => {
    const { data } = await AxiosClient.get(`categories/${params.categoryId}`);
    return data;
  };

  const deleteHandler = async () => {
    try {
      await AxiosClient.delete(`/categories/${params.categoryId}`);
      nav("/categories");
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

  const backHandler = () => nav(`/categories/${params.categoryId}/edit`);

  useEffect(() => {
    setSendRequest(true);
    fetchCategory()
      .then(
        (data) => {
          setCategoryName(data.name);
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

  return (
    <Paper sx={{ p: 1, mt: 2 }}>
      <Grid container spacing={2} direction="row">
        <Grid item xs={12}>
          <PageTitle title={categoryName} />
          Are you sure delete category?
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            size="small"
            sx={{ p: 1, mr: 1 }}
            color="error"
            onClick={deleteHandler}
          >
            <CheckIcon />
            Delete category
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ p: 1 }}
            onClick={backHandler}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12}>
          {alert.state && <HttpErrorNotification message={alert.message} />}
          {sendRequest && <LoadingBar />}
        </Grid>
      </Grid>
    </Paper>
  );
}
