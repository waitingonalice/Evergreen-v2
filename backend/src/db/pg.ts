import { Pool, PoolClient, QueryConfig, QueryResultRow } from "pg";
import { Env } from "../utils";

class PgClient {
  private client: Pool;
  private stats?: Record<string, number | string>;

  constructor() {
    const config = {
      connectionString: Env.DATABASE_URL,
      allowExitOnIdle: false,
      connectionTimeoutMillis: 10000, // 10 seconds
      idle_in_transaction_session_timeout: 10000,
      lock_timeout: 10000,
    };

    this.client = new Pool(config);

    this.client.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      this.client.end();
      process.exit(-1);
    });

    this.stats = {
      totalCount: 0,
      idleCount: 0,
      waitingCount: 0,
      lastQuery: "",
    };
  }

  private setStats(lastQuery?: string) {
    this.stats = {
      totalCount: this.client.totalCount,
      idleCount: this.client.idleCount,
      waitingCount: this.client.waitingCount,
      lastQuery: lastQuery || "",
    };
  }

  clientHealthCheck = async () => {
    const statement = `SELECT * FROM "Account" LIMIT 1`;
    try {
      await this.client?.query(statement);
      this.setStats(statement);
    } catch (err) {
      console.error("PostgreSQL is not connected");
      console.error(err);
      this.setStats(statement);
      console.error(this.stats);
    }
  };

  /**
   * For simple queries that do not require a transaction
   */
  query = <T extends QueryResultRow>({
    text,
    values,
    name,
  }: QueryConfig<any[]>) => {
    try {
      return this.client.query<T>({
        text,
        values,
        name,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  /**
   * For queries that require a long running transaction
   */
  transaction = async <T>(
    callback: (args: PoolClient) => Promise<T>,
  ): Promise<T | null> => {
    const client = await this.client.connect();
    let res: T | null = null;
    try {
      await client.query("BEGIN");
      const queryResponse = await callback(client);
      await client.query("COMMIT");
      res = queryResponse;
    } catch (err) {
      console.error(err);
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
    return res;
  };
}

export const pg = new PgClient();
