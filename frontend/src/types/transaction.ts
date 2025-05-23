interface GroupTransactions {
  id: string;
  amount: number;
  notes: string;
  type: string;
  category: {
    name: true;
  };
}

export interface ITransaction {
  day: Date;
  total: number;
  transactions: GroupTransactions[];
}
