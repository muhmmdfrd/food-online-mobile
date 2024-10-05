export type OrderDetailRequest = {
  orderId: number;
  userId: number;
  details: OrderDetailItem[];
};

export type OrderDetailItem = {
  menuId: number;
  qty: number;
};
