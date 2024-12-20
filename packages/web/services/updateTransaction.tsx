import axios from 'axios';

type UpdateTransactionProps = {
  id: string;
  data: {
    name: string;
    amount: number;
  };
};

const updateTransaction = async ({ id, data }: UpdateTransactionProps) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${id}`;

  const result = await axios.put(url, data);
};

export default updateTransaction;
