import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { CreateLoteTable1744340116573 } from "../migrations/1744340116573-CreateLoteTable.js";
import { CreateBoletosTable1744339920331 } from "../migrations/1744339920331-CreateBoletosTable.js";
import { Bill } from '../entities/Bill.js';
import { Lot } from '../entities/Lot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "green_acesso_db",
  entities: [Bill, Lot],
  migrations: [
    CreateLoteTable1744340116573,
    CreateBoletosTable1744339920331
  ],
  entitySkipConstructor: true,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false
  } : undefined,
  cache: {
    duration: 30000,
    type: "database",
    alwaysEnabled: true
  },
  connectTimeoutMS: 60000,
  extra: {
    max: 100,
    idleTimeoutMillis: 30000
  }
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Conexão com o banco de dados PostgreSQL estabelecida com sucesso.");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
};