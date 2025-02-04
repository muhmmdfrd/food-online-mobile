import { PagingRequest } from "@/models/requests/PagingRequest";
import { get } from "./IndexService";
import { StringHelper } from "@/helpers";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { PagingResponse } from "@/models/responses/PagingResponse";
import { Role } from "@/models/role";

const getRoles = async (
  data: PagingRequest
): Promise<ApiResponse<PagingResponse<Role[]>>> => {
  const qs = StringHelper.pagingToQueryString(data);
  const uri = `roles${qs}`;
  const resp = await get(uri);
  return resp;
};

export { getRoles };
