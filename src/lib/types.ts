export type Transaction = {
  id: string;
  date: string;
  description: string;
  category:
    | 'Income'
    | 'Housing'
    | 'Food'
    | 'Transport'
    | 'Entertainment'
    | 'Other';
  amount: number;
  type: 'income' | 'expense';
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
};
