export type OrderDetailHistoryResponse = {
  code: string;
  date: string;
  total: number;
  orderDetails: item[];
  orderPayment: payment;
};

type item = {
  name: string;
  qty: number;
  price: number;
  total: number;
};

type payment = {
  totalPayment: number;
  cashback: number;
};
