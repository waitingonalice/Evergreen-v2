import { useMutation } from "react-query";
import { apiRoutes } from "@/constants";
import { AxiosFactory } from "@/utils";
import { FormProps } from "../type";

interface CreateResumeResponse {
  result: string;
}
export const useCreateResume = () => {
  const { client } = new AxiosFactory();
  const createResume = async (data: FormProps) => {
    const res = await client.post<CreateResumeResponse>(
      apiRoutes.v1.cv.create,
      data,
    );
    return res.data;
  };

  const { mutateAsync, ...rest } = useMutation(createResume);
  return [mutateAsync, rest] as const;
};
