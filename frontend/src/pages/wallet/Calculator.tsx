import { Grid, TextField, Button, Alert } from "@mui/material";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import RefreshIcon from "@mui/icons-material/Refresh";
import AxiosClient from "../../utils/axios";
import { superUserId } from "../../utils/super-user";
import { formatNumberWithSeparator } from "../../utils/number-formatter";
import { CurrencyType } from "../../types/currency";

interface WealthProps {
  userId: string;
  currency: string;
  totalAmount: number;
}

export function Calculator({ totalAmount, userId, currency }: WealthProps) {
  const [card, setCard] = useState(0);
  const [cash, setCash] = useState(0);

  const difference = card + cash - totalAmount;

  const setCardAmount = (amount: number) => {
    setCard(amount);
  };

  const setCashAmount = (amount: number) => {
    setCash(amount);
  };

  const fetchClickBalance = async () => {
    const { data } = await AxiosClient.get("transactions/click");
    setCardAmount(data.balance);
  };

  return (
    <Grid container spacing={1} direction="column" alignItems="left">
      <Grid item xs={12}>
        <NumericFormat
          thousandSeparator
          customInput={TextField}
          value={cash}
          onValueChange={(values) => setCashAmount(Number(values.value))}
          allowNegative={false}
          decimalScale={2}
          required
          fullWidth
          id="cash"
          label="Cash"
          InputLabelProps={{ shrink: true }}
          type="tel"
        />
      </Grid>
      <Grid item xs={12}>
        <NumericFormat
          thousandSeparator
          customInput={TextField}
          value={card}
          onValueChange={(values) => setCardAmount(Number(values.value))}
          allowNegative={false}
          decimalScale={2}
          required
          fullWidth
          id="card"
          label="Card"
          InputLabelProps={{ shrink: true }}
          type="tel"
        />
      </Grid>
      <Grid item xs={12}>
        {userId === superUserId && currency === CurrencyType.UZS && (
          <Button variant="outlined" onClick={fetchClickBalance}>
            <RefreshIcon />
          </Button>
        )}
        {difference !== 0 && (
          <Button variant="outlined" color="warning" sx={{ marginLeft: 1 }}>
            Difference: {formatNumberWithSeparator(difference)}
          </Button>
        )}
      </Grid>
      <Grid item xs={12}>
        <b>Total:</b> {formatNumberWithSeparator(totalAmount)} {currency}
      </Grid>
    </Grid>
  );
}
