import { PagingRequest } from "@/models/requests/PagingRequest";
import { get } from "./IndexService";
import { StringHelper } from "@/helpers";
import { Merchant } from "@/models/merchant";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { PagingResponse } from "@/models/responses/PagingResponse";
import { Menu } from "@/models/menu";

const getMenu = async (
  data: PagingRequest
): Promise<ApiResponse<PagingResponse<Menu[]>>> => {
  const qs = StringHelper.pagingToQueryString(data);
  const uri = `menus${qs}`;
  const resp = await get(uri);
  return resp;
};

export { getMenu };
