export type PagingRequest = {
  keyword?: string;
  current: number;
  size: number;
  sortName?: string;
  sortDir?: string;
};
