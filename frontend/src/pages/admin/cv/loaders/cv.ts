import { useMutation } from "react-query";
import { apiRoutes } from "@/constants";
import { useLazyQuery } from "@/hooks/useLazyQuery";
import { AxiosFactory } from "@/utils";
import { FormProps } from "../type";

interface CreateResumeResponse {
  result: string;
}

export const initFormData = {
  languages: [],
  techstack: [],
  experiences: [],
  certifications: [],
  projects: [],
} as FormProps;

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

interface GetResumeResponse {
  result: FormProps;
}
export const useGetResume = () => {
  const { client } = new AxiosFactory();
  const getResume = async (id?: string) => {
    if (!id) return { result: initFormData };
    const res = await client.get<GetResumeResponse>(apiRoutes.v1.cv.get(id));
    return res.data;
  };

  return useLazyQuery(["cacheGetCV"], (id?: string) => getResume(id));
};
