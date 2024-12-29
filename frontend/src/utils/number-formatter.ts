export const formatNumberWithSeparator = (number: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  });
  return formatter.format(number);
};
