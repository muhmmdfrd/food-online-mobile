import { PagingRequest } from "@/models/requests/PagingRequest";

const pagingToQueryString = (data: PagingRequest): string => {
  const qs = Object.entries(data)
    .filter(([_, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  return `?${qs}`;
};

const currencyFormat = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

const StringHelper = {
  pagingToQueryString,
  currencyFormat,
};

export default StringHelper;
