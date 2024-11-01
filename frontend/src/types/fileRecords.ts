import { FileContentTypeEnum } from "@waitingonalice/utilities";
import { BucketEnum, StatusEnum } from "@/constants";

export interface FileType {
  name: string;
  size: number;
  type: FileContentTypeEnum;
  src?: string;
}

export interface RecordsType {
  id: string;
  status: StatusEnum;
  created_at: Date;
  type: BucketEnum;
  file: Partial<FileType>;
}
