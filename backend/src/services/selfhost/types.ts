import { z } from "zod";
import { Maybe, File } from "../../types";
import { ListSelfHostServicesResult } from "../../models";
import { addNewServiceSchema } from "./validation";

export type SelfHostedServiceResponseType = Omit<
  ListSelfHostServicesResult,
  | "gr_id"
  | "gr_name"
  | "group_id"
  | "filename"
  | "filesize"
  | "filetype"
  | "filesrc"
> & {
  file: File;
};

export type GroupedSelfHostedServiceResponseType = {
  name: Maybe<string>;
  id: Maybe<number>;
  services: SelfHostedServiceResponseType[];
};

export type AddNewServiceInputType = z.infer<typeof addNewServiceSchema>;
