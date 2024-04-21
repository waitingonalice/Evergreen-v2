import { RoleEnum } from "@/constants";

export interface Account {
  id: string;
  email: string;
  username: string;
  role: RoleEnum;
  country: string;
  password: string;
  is_active: boolean;
  updatedAt: string;
  createdAt: string;
}
