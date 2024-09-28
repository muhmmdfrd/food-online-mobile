import { User } from "@/models/user";
import StorageHelper from "./StorageHelper";
import { Storage } from "@/constants/Storage";

const getToken = (): Promise<string | null> => {
  return StorageHelper.getData(Storage.token);
};

const setToken = async (token: string) => {
  await StorageHelper.storeData(Storage.token, token);
};

const getCurrentUser = async (): Promise<User> => {
  const json = (await StorageHelper.getData(Storage.currentUser)) ?? "";
  return JSON.parse(json) as User;
};

const setCurrentUser = async (value: User) => {
  await StorageHelper.storeData(Storage.currentUser, JSON.stringify(value));
};

const getCode = async (): Promise<string | null> => {
  return StorageHelper.getData(Storage.code);
};

const setCode = async (value: string) => {
  await StorageHelper.storeData(Storage.code, value);
};

const isAuthorized = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null;
};

const AuthHelper = {
  getToken,
  setToken,
  isAuthorized,
  getCurrentUser,
  setCurrentUser,
  getCode,
  setCode,
};

export default AuthHelper;
