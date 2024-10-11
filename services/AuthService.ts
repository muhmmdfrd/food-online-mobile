import { AuthRequest } from "@/models/requests/AuthRequest";
import { post } from "./IndexService";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { AuthResponse } from "@/models/responses/AuthResponse";
import { RefreshTokenRequest } from "@/models/requests/RefreshTokenRequest";
import { AuthRevokeResponse } from "@/models/responses/AuthRevokeResponse";

const auth = async (data: AuthRequest): Promise<ApiResponse<AuthResponse>> => {
  return await post("auth", data);
};

const logout = async (code: string): Promise<ApiResponse<any>> => {
  return await post("auth/logout", { code });
};

const refreshToken = (
  request: RefreshTokenRequest
): Promise<ApiResponse<AuthRevokeResponse>> => {
  return post("auth/revoke", request);
};

export { auth, logout, refreshToken };
