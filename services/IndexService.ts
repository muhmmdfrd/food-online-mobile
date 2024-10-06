import { AuthHelper } from "@/helpers";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Config from "react-native-config";

const client = axios.create({
  baseURL: "http://api.safeplace.id/api",
  timeoutErrorMessage: "No internet connection.",
});

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AuthHelper.getToken();
  config.responseType = "json";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => {
    switch (response.data.code) {
      case "1001":
        throw "Unathorized.";
      case "1004":
        throw "Data not found. Please recheck your data.";
      case "4000":
        throw "Bad request.";
      case "9999":
        throw "Something went wrong.";
      default:
        return response.data;
    }
  },
  (err: AxiosError) => {
    const { reject } = Promise;
    switch (err.response?.status) {
      case 401:
        return reject("Unauthorized.");
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
