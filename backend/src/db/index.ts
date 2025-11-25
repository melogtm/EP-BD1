import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas/schemas";
import * as dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL!;

console.log(connectionString);

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export const migrationClient = postgres(connectionString, { max: 1 });
