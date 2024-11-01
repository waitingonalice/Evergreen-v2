import { FileContentTypeEnum } from "@waitingonalice/utilities";

export type Maybe<T> = T | null;
export type ExtractClassProperties<C> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [Key in keyof C as C[Key] extends Function ? never : Key]: C[Key];
};

export interface File {
  name: Maybe<string>;
  size: Maybe<number>;
  type: Maybe<FileContentTypeEnum>;
  src: Maybe<string>;
}
