import { PagingRequest } from "@/models/requests/PagingRequest";
import { get } from "./IndexService";
import { StringHelper } from "@/helpers";
import { Merchant } from "@/models/merchant";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { PagingResponse } from "@/models/responses/PagingResponse";

const getMerchant = async (
  data: PagingRequest
): Promise<ApiResponse<PagingResponse<Merchant[]>>> => {
  const qs = StringHelper.pagingToQueryString(data);
  const uri = `merchants${qs}`;
  const resp = await get(uri);
  return resp;
};

export { getMerchant };
