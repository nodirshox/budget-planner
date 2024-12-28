export interface IWallet {
  id: string;
  name: string;
  amount: number;
  currency: {
    name: string;
  };
}
