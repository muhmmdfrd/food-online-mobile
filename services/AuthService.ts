import { AuthRequest } from "@/models/requests/AuthRequest";
import { post } from "./IndexService";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { AuthResponse } from "@/models/responses/AuthResponse";

const auth = async (data: AuthRequest): Promise<ApiResponse<AuthResponse>> => {
  return await post("auth", data);
};

const logout = async (code: string): Promise<ApiResponse<any>> => {
  return await post("auth/logout", { code });
};

export { auth, logout };
