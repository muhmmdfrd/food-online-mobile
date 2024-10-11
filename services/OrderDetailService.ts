import { ApiResponse } from "@/models/responses/ApiResponse";
import { get } from "./IndexService";
import { OrderTodayResponse } from "@/models/responses/OrderTodayResponse";

const getOrderToday = (): Promise<ApiResponse<OrderTodayResponse[]>> => {
  return get("order-details/today");
};
export { getOrderToday };
