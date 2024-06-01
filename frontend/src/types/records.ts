import { BucketTypeEnum, StatusEnum } from "@/constants";

export interface RecordsType {
  id: string;
  filename: string;
  filesize: number;
  status: StatusEnum;
  created_at: Date;
  type: BucketTypeEnum;
}
