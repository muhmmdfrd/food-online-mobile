import { useAuth } from "@/app/context";
import { Response } from "@/constants/Response";
import { AuthHelper } from "@/helpers";
import { RefreshTokenRequest } from "@/models/requests/RefreshTokenRequest";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { AuthRevokeResponse } from "@/models/responses/AuthRevokeResponse";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeoutErrorMessage: "No internet connection.",
});

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AuthHelper.getToken();
  config.responseType = "json";
  if (token) {
    // console.log(token);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => {
    switch (response.data.code) {
      case Response.unauthorizedCode:
        throw "Unathorized response.";
      case "1004":
        throw "Data not found.";
      case "4000":
        throw "Bad request.";
      case "9999":
        throw "Something went wrong.";
      default:
        return response.data;
    }
  },
  async (err: AxiosError<ApiResponse<any>>) => {
    const { reject } = Promise;
    switch (err.response?.status) {
      case 401:
        try {
          if (err.response.data.code === Response.unauthorizedCode) {
            return reject(err.response.data.message);
          }

          const user = await AuthHelper.getCurrentUser();
          const refreshToken = await AuthHelper.getCode();

          const request: RefreshTokenRequest = {
            code: refreshToken ?? "",
            userId: user.id,
          };

          if (refreshToken == "" || user.id == 0) {
            return;
          }

          const response = await axios
            .post<ApiResponse<AuthRevokeResponse>>(
              `${process.env.EXPO_PUBLIC_API_URL}/auth/revoke`,
              request
            )
            .then((d) => d.data);

          if (response.success) {
            await AuthHelper.setCode(response.data.code);
            await AuthHelper.setToken(response.data.token);

            const value = `Bearer ${response.data.token}`;
            err.config!.headers.Authorization = value;

            return client(err.config!);
          }

          const { logout } = useAuth();
          logout();
          return reject("Unauthorized error.");
        } catch (err) {
          const error = err as { message: { message: string } };
          return reject(error.message.message);
        }
      case undefined:
        return reject("No internet connection.");
      default:
        return reject("Something went wrong.");
    }
  }
);

const get = async (endpoint: string): Promise<any> => {
  return await client.get(endpoint);
};

const post = async (endpoint: string, data: any): Promise<any> => {
  return await client.post(endpoint, data);
};

const put = async (endpoint: string, data: any): Promise<any> => {
  return await client.put(endpoint, data);
};

export { get, post, put };
