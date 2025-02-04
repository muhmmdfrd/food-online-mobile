export type PagingResponse<T> = {
  total: number;
  filtered: number;
  size: number;
  data: T;
};
