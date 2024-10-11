import {
  OrderDetailItem,
  OrderDetailRequest,
} from "@/models/requests/OrderDetailRequest";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { get, post } from "./IndexService";
import { CalculateResponse } from "@/models/responses/CalculateResponse";

const calculate = (
  items: OrderDetailItem[]
): Promise<ApiResponse<CalculateResponse>> => {
  return post("order-details/calculate", items);
};

const createOrder = (
  request: OrderDetailRequest
): Promise<ApiResponse<any>> => {
  return post("order-details", request);
};

const getMyOrders = (userId: number): Promise<ApiResponse<OrderResponse[]>> => {
  return get(`orders/user/${userId}`);
};

export { calculate, createOrder, getMyOrders };
