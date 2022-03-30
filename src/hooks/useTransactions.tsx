import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { api } from '../services/api';


interface ITransactionsProps {
  id: string;
  title: string;
  type: string;
  amount: number;
  category: string;
  createdAt: string;
}

interface ITransactionsContextData {
  transactions: ITransactionsProps[];
  createTransaction: (transaction: ITransactionsInputProps) => Promise<void>;
}

type ITransactionsInputProps = Omit<ITransactionsProps, 'id' | 'createdAt'>

interface ITransactionsProviderProps {
  children: ReactNode;
}



const TransactionsContext = createContext<ITransactionsContextData>(
  {} as ITransactionsContextData
);


export function TransactionsProvider({ children }: ITransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransactionsProps[]>([])

  useEffect(() => {
    api.get('transactions')
      .then(response => setTransactions(response.data.transactions))
  }, []);

  async function createTransaction(transactionInput: ITransactionsInputProps) {
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date()
    });
    const { transaction } = response.data;

    setTransactions([
      ...transactions,
      transaction
    ]);
  }


  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }} >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);


  return context;
}