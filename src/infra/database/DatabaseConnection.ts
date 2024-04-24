import pgp from "pg-promise";

export default interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>;

  close(): Promise<void>
}

export class PgPromiseAdapter implements DatabaseConnection {
  private readonly connection: pgp.IDatabase<{}>;

  constructor() {
    this.connection = pgp()("postgres://root:root@localhost:5432/cccat16_1");
  }

  query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  close(): Promise<void> {
    return this.connection.$pool.end();
  }
}
