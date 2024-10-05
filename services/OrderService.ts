import { OrderDetailItem } from "@/models/requests/OrderDetailRequest";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { post } from "./IndexService";
import { CalculateResponse } from "@/models/responses/CalculateResponse";

const calculate = (
  items: OrderDetailItem[]
): Promise<ApiResponse<CalculateResponse>> => {
  return post("order-details/calculate", items);
};

export { calculate };
