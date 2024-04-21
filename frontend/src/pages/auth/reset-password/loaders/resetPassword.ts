import { useMutation } from "react-query";
import { apiRoutes } from "@/constants";
import { AxiosFactory } from "@/utils";

interface ResetPasswordInput {
  password: string;
  token: string;
}

interface ResetPasswordResponse {
  result: string;
}
export const useResetPassword = () => {
  const { client } = new AxiosFactory();
  const resetPassword = async (form: ResetPasswordInput) => {
    const { data } = await client.post<ResetPasswordResponse>(
      apiRoutes.v1.auth.resetPassword,
      form,
    );
    return data;
  };

  const { mutateAsync, ...rest } = useMutation({
    mutationFn: resetPassword,
  });

  return [mutateAsync, rest] as const;
};
