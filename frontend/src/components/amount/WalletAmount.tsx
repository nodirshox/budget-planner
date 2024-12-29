import React from "react";
import Typography from "@mui/material/Typography";
import { red, green } from "@mui/material/colors";
import { formatNumberWithSeparator } from "../../utils/number-formatter";

interface WalletAmountProps {
  amount: number;
  currency: string;
}

const WalletAmount: React.FC<WalletAmountProps> = ({ amount, currency }) => {
  const formattedAmount = `${formatNumberWithSeparator(amount)} ${currency}`;

  return (
    <Typography
      style={{
        color: amount < 0 ? red[500] : green[500],
      }}
      sx={{ fontWeight: 500 }}
      variant="subtitle1"
      component="div"
    >
      {formattedAmount}
    </Typography>
  );
};

export default WalletAmount;
