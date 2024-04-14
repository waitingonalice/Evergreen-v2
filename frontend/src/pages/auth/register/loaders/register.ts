import { useMutation } from "react-query";
import { CountryEnum, apiRoutes } from "@/constants";
import { AxiosFactory } from "@/utils";

export interface RegisterNewUserType {
  email: string;
  password: string;
  username: string;
  country: CountryEnum | string;
  secret: string;
}
export const useRegister = () => {
  const factory = new AxiosFactory().client;

  const registerUser = async (input: RegisterNewUserType) => {
    const { data } = await factory.post(apiRoutes.v1.auth.register, input);
    return data;
  };

  const { mutateAsync, ...rest } = useMutation(registerUser);
  return [mutateAsync, rest] as const;
};
