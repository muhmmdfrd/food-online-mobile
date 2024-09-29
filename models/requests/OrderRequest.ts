export type OrderRequest = {
  orderId: number;
  userId: number;
  details: OrderDetailRequest[];
};

export type OrderDetailRequest = {
  menuId: number;
  qty: number;
};
