export type OrderTodayResponse = {
  name: string;
  total: number;
  details: OrderTodayDetailsResponse[];
};

export type OrderTodayDetailsResponse = {
  menuName: string;
  qty: number;
  price: number;
};
