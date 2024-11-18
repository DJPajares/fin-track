import axios from 'axios';

type UpdateTransactionProps = {
  id: string;
  data: {
    name: string;
    amount: number;
  };
};

const updateTransaction = async ({ id, data }: UpdateTransactionProps) => {
  const url = `http://localhost:3001/api/v1/transactions/${id}`;

  const result = await axios.put(url, data);
};

export default updateTransaction;
