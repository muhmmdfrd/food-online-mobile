export type OrderDetailRequest = {
  paymentAmount: number;
  details: OrderDetailItem[];
};

export type OrderDetailItem = {
  menuId: number;
  qty: number;
};
