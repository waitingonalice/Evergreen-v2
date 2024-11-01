import { Maybe } from "@waitingonalice/utilities";
import { FileType } from "./fileRecords";

export interface GroupType {
  id: number;
  name: string;
}

export interface ServiceType {
  id: string;
  name: string;
  url: Maybe<string>;
  created_at: string;
  file: FileType;
}
