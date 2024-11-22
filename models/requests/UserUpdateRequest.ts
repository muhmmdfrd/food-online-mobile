import { User } from "../user";

export type UserUpdateRequest = User & { password: string; file: string };
