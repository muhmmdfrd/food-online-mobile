import { ApiResponse } from "@/models/responses/ApiResponse";
import { put } from "./IndexService";

const updateFirebaseToken = async (
  token: string
): Promise<ApiResponse<any>> => {
  return await put("users/firebase-token", { token: token });
};

export { updateFirebaseToken };
