import { pg } from "../db";
import { ExtractClassProperties, Maybe } from "../types";
import { FilesModel } from "./files";
import { File } from "../types";

export interface ListSelfHostServicesResult {
  gr_id: Maybe<number>;
  gr_name: Maybe<string>;
  id: Maybe<string>;
  name: Maybe<string>;
  url: Maybe<string>;
  created_at: Maybe<string>;
  filename: File["name"];
  filesize: File["size"];
  filetype: File["type"];
  filesrc: File["src"];
}

export class SelfHostedModel {
  id?: Maybe<string>;
  name?: Maybe<string>;
  accountId?: string;
  url?: Maybe<string>;
  created_at?: string;
  group_id?: Maybe<number>;
  filesModel?: Maybe<FilesModel>;

  constructor({
    id,
    name,
    accountId,
    url,
    created_at,
    group_id,
    filesModel,
  }: ExtractClassProperties<SelfHostedModel>) {
    this.name = name;
    this.id = id;
    this.accountId = accountId;
    this.url = url;
    this.created_at = created_at;
    this.group_id = group_id;
    this.filesModel = filesModel;
  }

  async listSelfHostServices() {
    const statement = `
      WITH selfhosted AS (
        SELECT sh.id,
        sh.name,
        sh.url,
        sh.created_at,
        sh.group_id,
        sh.account_id,
        f.name as filename,
        f.size as filesize,
        f.type as filetype,
        f.src as filesrc
        FROM "SelfHosted" as sh
        LEFT JOIN "Files" as f
        ON sh.id = f.self_hosted_id
        WHERE sh.account_id = $1
    )

    SELECT gr.id as gr_id,
        gr.name as gr_name,
        sh.id,
        sh.name,
        sh.url,
        sh.created_at,
        sh.filename,
        sh.filesize,
        sh.filetype,
        sh.filesrc
        FROM "SelfHostedGroup" as gr
        FULL JOIN selfhosted as sh
        ON gr.id = sh.group_id
        WHERE gr.account_id = $1
        OR sh.account_id = $1
        ORDER BY gr.id DESC
    `;

    const params = [this.accountId];
    const data = await pg.query<ListSelfHostServicesResult>({
      text: statement,
      values: params,
    });

    return data?.rows ?? [];
  }

  async listServicesPerGroup() {
    const statement = `
      SELECT id, name, url FROM "SelfHosted"
      WHERE group_id = $1 AND account_id = $2
    `;

    const params = [this.group_id, this.accountId];
    const data = await pg.query<
      Pick<ListSelfHostServicesResult, "id" | "name" | "url">
    >({
      text: statement,
      values: params,
    });
    return data?.rows;
  }

  addNewSelfHost() {
    const statement = `
      INSERT INTO "SelfHosted" (name, url, group_id, id, account_id)
      VALUES ($1, $2, $3, $4, $5)
    `;

    const selfHostParams = [
      this.name,
      this.url,
      this.group_id,
      this.id,
      this.accountId,
    ];

    return pg.transaction(async (client) => {
      const data = await client.query({
        text: statement,
        values: selfHostParams,
      });
      if (this.filesModel) await this.filesModel.addSelfHostedFile(client);

      return data?.rowCount;
    });
  }

  async deleteSelfHost() {
    const statement = `
      DELETE FROM "SelfHosted"
      WHERE id = $1
    `;
    const params = [this.id];

    const res = await pg.query({
      text: statement,
      values: params,
    });

    return res?.rowCount;
  }

  async updateSelfHost() {
    const statement = `UPDATE "SelfHosted"
      SET name = $1, url = $2, group_id = $3
      WHERE id = $4
    `;
    const params = [this.name, this.url, this.group_id, this.id];
    const updatedData = await pg.query({
      text: statement,
      values: params,
    });

    if (updatedData?.rowCount && updatedData.rowCount > 0) {
      const queryStatement = `
        SELECT * FROM "SelfHosted"
        WHERE id = $1
      `;
      const queryParams = [this.id];
      const queryData = await pg.query({
        text: queryStatement,
        values: queryParams,
      });
      return queryData?.rows[0];
    }

    return null;
  }
}
