import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { IWallet } from "./types/wallet";
import { formatNumberWithSeparator } from "../../utils/number-formatter";
import { CurrencyType } from "../../types/currency";

interface WealthProps {
  wallets: IWallet[];
}

export function Wealth({ wallets }: WealthProps) {
  const [totalUzs, setTotalUzs] = useState(0);
  const [totalUsd, setTotalUsd] = useState(0);
  const [usdRate, setUsdRate] = useState(0);
  const [totalWealthUzs, setTotalWealthUzs] = useState(0);
  const [totalWealthUsd, setTotalWealthUsd] = useState(0);

  useEffect(() => {
    fetch("https://cbu.uz/oz/arkhiv-kursov-valyut/json/")
      .then((response) => response.json())
      .then((data) => {
        const usdData = data.find((item: any) => item.Ccy === "USD");
        if (usdData) {
          setUsdRate(Number(usdData.Rate));
        }
      })
      .catch((error) => console.error("Error fetching USD rate:", error));

    const uzsSum = wallets
      .filter((w) => w.currency.name === CurrencyType.UZS)
      .reduce((prev, w) => prev + w.amount, 0);
    setTotalUzs(uzsSum);

    const usdSum = wallets
      .filter((w) => w.currency.name === CurrencyType.USD)
      .reduce((prev, w) => prev + w.amount, 0);
    setTotalUsd(usdSum);
  }, [wallets]);

  useEffect(() => {
    const wealthInUzs = totalUzs + totalUsd * usdRate;
    const wealthInUsd = totalUsd + totalUzs / usdRate;

    setTotalWealthUzs(Math.floor(wealthInUzs));
    setTotalWealthUsd(wealthInUsd);
  }, [totalUzs, totalUsd, usdRate]);

  return (
    <Grid
      container
      paddingLeft={1}
      paddingRight={1}
      direction="column"
      alignItems="left"
    >
      <Grid item xs={12}>
        Wealth
        <br />
        <b>{formatNumberWithSeparator(totalWealthUzs)} UZS</b>
        <br />
        <b>{formatNumberWithSeparator(totalWealthUsd)} USD</b>
      </Grid>
    </Grid>
  );
}
