import { get } from "./IndexService";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { Dashboard } from "@/models/dashboard";

const getDashboard = async (): Promise<ApiResponse<Dashboard>> => {
  const resp = await get("dashboards");
  return resp;
};

export { getDashboard };
