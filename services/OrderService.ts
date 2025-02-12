import {
  OrderDetailItem,
  OrderDetailRequest,
} from "@/models/requests/OrderDetailRequest";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { get, post, put } from "./IndexService";
import { CalculateResponse } from "@/models/responses/CalculateResponse";
import { OrderDetailHistoryResponse } from "@/models/responses/OrderDetailHistoryResponse";
import { PaymentUpdateStatusRequest } from "@/models/requests/PaymentUpdateStatusRequest";

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

const getMyOrderDetail = (
  userId: number,
  orderId: number
): Promise<ApiResponse<OrderDetailHistoryResponse>> => {
  return get(`orders/user/${userId}/detail/${orderId}`);
};

const openOrder = (): Promise<ApiResponse<any>> => {
  return post("orders", {});
};

const updatePaymentStatus = (
  request: PaymentUpdateStatusRequest
): Promise<ApiResponse<number>> => {
  return put("orders/payment", request);
};

export {
  calculate,
  createOrder,
  getMyOrders,
  getMyOrderDetail,
  openOrder,
  updatePaymentStatus,
};
