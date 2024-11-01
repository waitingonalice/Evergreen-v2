import { PoolClient } from "pg";
import { File, Maybe } from "../types";

interface FilesModelArgs extends File {
  record_id?: Maybe<string>;
  self_hosted_id?: Maybe<string>;
}
export class FilesModel {
  name: File["name"];
  size: File["size"];
  type: File["type"];
  src: File["src"];
  record_id?: Maybe<string>;
  self_hosted_id?: Maybe<string>;

  constructor({
    name,
    size,
    type,
    src,
    record_id,
    self_hosted_id,
  }: FilesModelArgs) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.src = src;
    this.record_id = record_id;
    this.self_hosted_id = self_hosted_id;
  }

  async addSelfHostedFile(client?: PoolClient) {
    const statement = `
      INSERT INTO "Files" (name, size, type, src, self_hosted_id)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const params = [
      this.name,
      this.size,
      this.type,
      this.src,
      this.self_hosted_id,
    ];
    const data = await client?.query({
      text: statement,
      values: params,
    });

    return data?.rowCount;
  }
}
