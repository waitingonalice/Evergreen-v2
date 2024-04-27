import { useMutation } from "react-query";
import { CountryEnum, RoleEnum, apiRoutes } from "@/constants";
import { Account } from "@/types/account";
import { AxiosFactory } from "@/utils";

export interface RegisterNewUserType {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  country: CountryEnum | string;
  secret: string;
  role: RoleEnum;
}

export type RegisterNewUserResponse = Pick<
  Account,
  "id" | "email" | "username" | "role" | "country" | "is_active"
>;
const factory = new AxiosFactory().client;
export const useRegister = () => {
  const registerUser = async (input: RegisterNewUserType) => {
    const { data } = await factory.post<RegisterNewUserResponse>(
      apiRoutes.v1.auth.register,
      input,
    );
    return data;
  };

  const { mutateAsync, ...rest } = useMutation(registerUser);
  return [mutateAsync, rest] as const;
};

export const useResendEmail = () => {
  const resendEmail = async (email: string) => {
    const { data } = await factory.post<RegisterNewUserResponse>(
      apiRoutes.v1.auth.resendEmail,
      {
        email,
      },
    );
    return data;
  };
  const { mutateAsync, ...rest } = useMutation(resendEmail);
  return [mutateAsync, rest] as const;
};
