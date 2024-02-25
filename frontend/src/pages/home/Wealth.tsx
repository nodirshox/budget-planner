import { Grid, TextField, Alert } from "@mui/material";
import React, { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";

interface WealthProps {
  usd: number;
  uzs: number;
}

export function Wealth({ usd, uzs }: WealthProps) {
  const [card, setCard] = useState(() => getInitialValue("card", 0));
  const [cash, setCash] = useState(() => getInitialValue("cash", 0));
  const [totalUzs, setTotalUzs] = useState(0);
  const [usdRate, setUsdRate] = useState(12500);

  const difference = totalUzs - uzs;
  const totalValue = totalUzs + usd * usdRate;

  const setCardAmount = (amount: number) => {
    setCard(amount);
    setTotalUzs(amount + cash);
    localStorage.setItem("card", JSON.stringify(amount));
  };

  const setCashAmount = (amount: number) => {
    setCash(amount);
    setTotalUzs(amount + card);
    localStorage.setItem("cash", JSON.stringify(amount));
  };

  useEffect(() => {
    setTotalUzs(card + cash);
    fetch("https://cbu.uz/oz/arkhiv-kursov-valyut/json/")
      .then((response) => response.json())
      .then((data) => {
        const usdData = data.find((item: any) => item.Ccy === "USD");
        if (usdData) {
          setUsdRate(Number(usdData.Rate));
        }
      })
      .catch((error) => console.error("Error fetching USD rate:", error));
  }, []);

  function formatNumberWithSeparator(number: number) {
    const formatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    });

    return formatter.format(number);
  }

  function getInitialValue(key: string, fallbackValue: number): number {
    const value = localStorage.getItem(key);
    return value !== null ? Number(value) : fallbackValue;
  }

  return (
    <Grid
      container
      spacing={2}
      paddingLeft={1}
      paddingRight={1}
      direction="column"
      alignItems="left"
    >
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
          label="Cash (UZS)"
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
          label="Card (UZS)"
          InputLabelProps={{ shrink: true }}
          type="tel"
        />
      </Grid>
      <Grid item xs={12}>
        Total
        <br />
        <b>{formatNumberWithSeparator(totalUzs)} UZS</b>
        {totalUzs !== uzs && (
          <Alert
            severity="warning"
            style={{ display: "inline-flex", marginLeft: "10px" }}
          >
            {formatNumberWithSeparator(difference)}
          </Alert>
        )}
      </Grid>
      <Grid item xs={12}>
        Total wealth
        <br />
        <b>{formatNumberWithSeparator(totalValue)} UZS</b>
      </Grid>
    </Grid>
  );
}
