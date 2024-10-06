export type OrderDetailRequest = {
  details: OrderDetailItem[];
};

export type OrderDetailItem = {
  menuId: number;
  qty: number;
};
