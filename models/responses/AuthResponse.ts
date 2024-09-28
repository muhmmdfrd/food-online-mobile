import { User } from "../user";

export type AuthResponse = {
  code: string;
  token: string;
  user: User;
};
