export type CalculateResponse = {
  grandTotal: number;
  items: CalculateDetailResponse[];
};

export type CalculateDetailResponse = {
  menuName: string;
  qty: number;
  total: number;
};
