import pgp from "pg-promise";

export default interface DatabaseConnection {
  query(statement: string, params: any, transactional?: boolean): Promise<any>;

  close(): Promise<void>

  commit(): Promise<void>
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

  async commit(): Promise<void> {
  }
}

export class UnityOfWork implements DatabaseConnection {
  private readonly connection: pgp.IDatabase<{}>;

  statements: { statement: string, params: any }[];

  constructor() {
    this.connection = pgp()("postgres://root:root@localhost:5432/cccat16_1");
    this.statements = [];
  }

  async query(statement: string, params: any, transactional: boolean = false): Promise<any> {
    if(!transactional) {
      return this.connection.query(statement, params);
    } else {
      this.statements.push({ statement, params });
    }
  }

  close(): Promise<void> {
    return this.connection.$pool.end();
  }

  async commit(): Promise<void> {
    await this.connection.tx(async (t: any) => {
      const transactions = [];
      for(const statement of this.statements) {
        transactions.push(await t.query(statement.statement, statement.params));
      }

      return t.batch(transactions);
    })
  }
}
