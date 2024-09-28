import { AuthRequest } from "@/models/requests/AuthRequest";
import { post } from "./IndexService";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { AuthResponse } from "@/models/responses/AuthResponse";

const auth = async (data: AuthRequest): Promise<ApiResponse<AuthResponse>> => {
  return await post("auth", data);
};

export { auth };
