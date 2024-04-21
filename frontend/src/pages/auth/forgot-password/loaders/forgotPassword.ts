import { useMutation } from "react-query";
import { apiRoutes } from "@/constants";
import { AxiosFactory } from "@/utils";

interface ForgotPasswordInput {
  email: string;
}

interface ForgotPasswordResponse {
  result: string;
}
export const useForgotPassword = () => {
  const { client } = new AxiosFactory();
  const triggerForgotPassword = async (email: ForgotPasswordInput) => {
    const { data } = await client.post<ForgotPasswordResponse>(
      apiRoutes.v1.auth.forgotPassword,
      email,
    );
    return data;
  };

  const { mutateAsync, ...rest } = useMutation({
    mutationFn: triggerForgotPassword,
  });

  return [mutateAsync, rest] as const;
};
