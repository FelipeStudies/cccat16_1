import crypto from "crypto";
import express, { Request, Response } from "express";
import pgp from "pg-promise";
import { validate as isValidCPF } from "./validateCpf";
import pg from "pg-promise/typescript/pg-subset";
const app = express();
app.use(express.json());

class APIError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode: number) {
    super(message);
  }
}

const DATABASE_URL = "postgres://root:root@localhost:5432/cccat16_1";

app.post("/signup", signUpController);

function connectToDatabase() {
  return pgp()(DATABASE_URL);
}

type Connection = pgp.IDatabase<{}, pg.IClient>;

function disconnectFromDatabase(connection: Connection) {
  return connection.$pool.end();
}

async function getAccountByEmail(connection: Connection, email: string) {
  const [account] = await connection.query("select * from cccat16.account where email = $1", [email]);
  return account;
}

function isValidName(name: string) {
  return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function isValidEmail(email: string) {
  return email.match(/^(.+)@(.+)$/);
}

function isValidCarPlate(carPlate: string) {
  return carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

interface CreateAccountParams {
  name: string
  email: string
  cpf: string
  type: 'passenger' | 'driver'
  carPlate?: string
}

interface Account extends CreateAccountParams {
  id: string
}

async function createAccount(connection: Connection, params: CreateAccountParams) {
  const { name, email, cpf, type, carPlate } = params;

  const id = crypto.randomUUID();

  await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, name, email, cpf, carPlate, type === 'passenger', type === 'driver']);

  return { id, name, email, cpf, type, carPlate } as Account;
}

async function signUpController(req: Request, res: Response) {
  const { name, email, cpf, isPassenger, isDriver, carPlate } = req.body;

  const connection = connectToDatabase();

	try {
		const account = await getAccountByEmail(connection, email)
    if(account) {
      throw new Error("already_exists");
    }

    if (!isValidName(name)) throw new Error('invalid_name');
    if (!isValidEmail(email)) throw new Error('invalid_email');
    if (!isValidCPF(cpf)) throw new Error('invalid_cpf');

    if(isDriver && !isValidCarPlate(carPlate)) throw new Error('invalid_car_plate');
    if(isPassenger && !!carPlate) throw new Error('car_plate_is_not_required');

    const { id } = await createAccount(connection, {
      name, email, cpf, type: isDriver ? 'driver' : 'passenger', carPlate,
    });

    return res.json(id);
  } catch (error: unknown) {
    let code: string;
    let message: string;
    let statusCode: number;

    if(error instanceof APIError) {
      code = error.code;
      message = error.message;
      statusCode = error.statusCode;
    } else if(error instanceof Error) {
      code = 'unknown';
      message = error.message;
      statusCode = 500;
    } else {
      code = 'unknown';
      message = 'Unknown message';
      statusCode = 500;
    }

    return res.status(statusCode).json({ code, message });
	} finally {
		await disconnectFromDatabase(connection);
	}
}

app.listen(3000);
