/* eslint-disable @typescript-eslint/no-empty-function */
import { useMutation, useQuery } from "react-query";
import { apiRoutes } from "@/constants";
import { Maybe } from "@/types";
import { FileType } from "@/types/fileRecords";
import { AxiosFactory } from "@/utils";

const { client } = new AxiosFactory();

export interface ServicesType {
  id: string;
  name: string;
  url: Maybe<string>;
  created_at: string;
  file: FileType;
}
export interface GroupsType {
  id: number;
  name: string;
  services: ServicesType[];
}
interface ListSelfHostedServicesResponse {
  result: {
    groups: GroupsType[];
    services: ServicesType[];
  };
}

const useListSelfHostServices = () => {
  const listSelfHostServices = async () => {
    const { data } = await client.get<ListSelfHostedServicesResponse>(
      apiRoutes.v1.services.index,
    );
    return data;
  };

  return useQuery("listSelfHostServices", listSelfHostServices);
};

interface AddNewGroupResponse {
  result: {
    id: number;
    name: string;
  };
}
interface AddNewGroupInput {
  name?: string;
}
const useAddNewGroup = () => {
  const addNewGroup = async (name?: string) => {
    const { data } = await client.post<AddNewGroupResponse>(
      apiRoutes.v1.services.group,
      { name },
    );
    return data;
  };

  const { mutateAsync, ...rest } = useMutation((arg: AddNewGroupInput) =>
    addNewGroup(arg.name),
  );
  return [mutateAsync, rest] as const;
};

export interface UpdateGroupInput {
  id: number;
  name: string;
}

const useUpdateGroup = () => {
  const updateGroup = async ({ id, name }: UpdateGroupInput) => {
    const { data } = await client.put<AddNewGroupResponse>(
      apiRoutes.v1.services.group,
      { id, name },
    );
    return data;
  };

  const { mutateAsync, ...rest } = useMutation((arg: UpdateGroupInput) =>
    updateGroup(arg),
  );
  return [mutateAsync, rest] as const;
};

export interface DeleteGroupInput {
  id: number;
}
const useDeleteGroup = () => {
  const deleteGroup = async (id: number) => {
    const { data } = await client.delete<AddNewGroupResponse>(
      `${apiRoutes.v1.services.group}/${id}`,
    );
    return data;
  };

  const { mutateAsync, ...rest } = useMutation((arg: DeleteGroupInput) =>
    deleteGroup(arg.id),
  );
  return [mutateAsync, rest] as const;
};

const useAddNewSelfHost = () => {};

const useUpdateSelfHost = () => {};

const useDeleteSelfHost = () => {};

export {
  useListSelfHostServices,
  useAddNewGroup,
  useUpdateGroup,
  useDeleteGroup,
  useAddNewSelfHost,
  useUpdateSelfHost,
  useDeleteSelfHost,
};
