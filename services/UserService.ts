import { ApiResponse } from "@/models/responses/ApiResponse";
import { put, get } from "./IndexService";
import { User } from "@/models/user";
import { UserUpdateRequest } from "@/models/requests/UserUpdateRequest";

const updateFirebaseToken = async (
  token: string
): Promise<ApiResponse<any>> => {
  return await put("users/firebase-token", { token: token });
};

const getById = async (id: number): Promise<ApiResponse<User>> => {
  return await get(`users/${id}`);
};

const updateUser = async (
  request: UserUpdateRequest
): Promise<ApiResponse<any>> => {
  return await put("users", request);
};

export { updateFirebaseToken, updateUser, getById };
