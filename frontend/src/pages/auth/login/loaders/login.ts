import { useMutation } from "react-query";
import { RoleEnum, apiRoutes } from "@/constants";
import { AxiosFactory } from "@/utils";

interface LoginInputType {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponseType {
  result: {
    token: string;
    refresh_token: string;
    role: RoleEnum;
  };
}
export const useLogin = () => {
  const { client } = new AxiosFactory();

  const login = async (input: LoginInputType) => {
    const { data } = await client.post<LoginResponseType>(
      apiRoutes.v1.auth.login,
      input,
    );
    return data;
  };
  const { mutateAsync, ...rest } = useMutation(login);
  return [mutateAsync, rest] as const;
};
