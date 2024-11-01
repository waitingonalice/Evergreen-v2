import { ExtractClassProperties } from "../types";
import { pg } from "../db";

export class SelfHostGroupModel {
  id?: number;
  name?: string;
  accountId?: string;

  constructor({
    id,
    name,
    accountId,
  }: ExtractClassProperties<SelfHostGroupModel>) {
    this.id = id;
    this.name = name;
    this.accountId = accountId;
  }

  addNewGroup() {
    const data = pg.transaction<{ id: number }>(async (client) => {
      const insertStatement = `
        INSERT INTO "SelfHostedGroup" (name, account_id)
        VALUES ($1, $2)
      `;
      const insertParams = [this.name, this.accountId];

      await client.query({
        text: insertStatement,
        values: insertParams,
      });

      const queryStatement = `
        SELECT id FROM "SelfHostedGroup"
        WHERE name = $1
      `;

      const data = await client.query({
        text: queryStatement,
        values: [this.name],
      });

      return data.rows[0];
    });

    return data;
  }

  async deleteGroup() {
    const statement = `
      DELETE FROM "SelfHostedGroup"
      WHERE id = $1 AND account_id = $2
    `;
    const params = [this.id, this.accountId];
    const res = await pg.query({
      text: statement,
      values: params,
    });
    return res?.rowCount;
  }

  async updateGroupName() {
    const statement = `
        UPDATE "SelfHostedGroup"
        SET name = $1
        WHERE id = $2 AND account_id = $3
      `;
    const params = [this.name, this.id, this.accountId];
    const data = await pg.query({
      text: statement,
      values: params,
    });
    return data?.rowCount;
  }

  async listGroups() {
    const statement = `
      SELECT id, name FROM "SelfHostedGroup"
      WHERE account_id = $1
    `;

    const params = [this.accountId];
    const data = await pg.query({
      text: statement,
      values: params,
    });

    return data?.rows;
  }
}
