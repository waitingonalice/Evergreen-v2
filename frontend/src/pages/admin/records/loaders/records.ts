import { BucketTypeEnum, StatusEnum, apiRoutes } from "@/constants";
import { useLazyQuery } from "@/hooks/useLazyQuery";
import { RecordsType } from "@/types/records";
import { AxiosFactory } from "@/utils";

export interface ListRecordInput {
  limit: number;
  index: number;
  status?: StatusEnum;
  filename?: string;
}

export type FilterInput = Partial<ListRecordInput>;

export interface RecordsResponse {
  result: RecordsType[];
  total_count: number;
}

export const DEFAULT_PAGINATION: ListRecordInput = {
  limit: 10,
  index: 0,
};

const { client } = new AxiosFactory();
export const useListRecords = () => {
  const listRecords = async (input?: ListRecordInput) => {
    const { data } = await client.get<RecordsResponse>(
      apiRoutes.v1.records.list,
      {
        params: input,
      },
    );
    return data;
  };
  return useLazyQuery(["cacheListRecords"], listRecords);
};

interface DownloadRecordInput {
  filename: string;
  bucket: BucketTypeEnum;
}
interface DownloadRecordResponse {
  result: string;
}
export const useDownloadRecord = () => {
  const downloadRecord = async (input?: DownloadRecordInput) => {
    if (!input)
      return {
        result: "",
      };
    const { data } = await client.get<DownloadRecordResponse>(
      apiRoutes.v1.records.download(input.bucket, input.filename),
      {
        params: {
          ...input,
          ...(input.bucket === BucketTypeEnum.Resume && {
            download_name: "resume.pdf",
          }),
        },
      },
    );
    return data;
  };
  return useLazyQuery(["cacheDownloadRecord"], downloadRecord);
};
