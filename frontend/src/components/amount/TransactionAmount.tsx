import React from "react";
import Typography from "@mui/material/Typography";
import { red, green } from "@mui/material/colors";
import { formatNumberWithSeparator } from "../../utils/number-formatter";
import { TransactionType } from "../../types/transaction-type";

interface TransactionAmountProps {
  amount: number;
  currency: string;
  type: string;
}

const TransactionAmount: React.FC<TransactionAmountProps> = ({
  amount,
  currency,
  type,
}) => {
  let formattedAmount = formatNumberWithSeparator(amount);

  formattedAmount = `${formattedAmount} ${currency}`;

  if (type === TransactionType.EXPENSE && amount !== 0) {
    formattedAmount = `-${formattedAmount}`;
  }

  return (
    <Typography
      component="span"
      style={{
        color: type === TransactionType.EXPENSE ? red[500] : green[500],
      }}
      sx={{ fontWeight: 500 }}
    >
      {formattedAmount}
    </Typography>
  );
};

export default TransactionAmount;
