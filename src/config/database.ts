import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { CreateLoteTable1744340116573 } from "../migrations/1744340116573-CreateLoteTable.js";
import { CreateBoletosTable174433992033789 } from '../migrations/174433992033789-CreateBoletosTable.js';

import { Bill } from '../entities/Bill.js';
import { Lot } from '../entities/Lot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });


export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "postgres",

  entities: [Bill, Lot],
  migrations: [
    CreateLoteTable1744340116573,
    CreateBoletosTable174433992033789
  ],

  entitySkipConstructor: true,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",

  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false
  } : undefined,

  cache: false,

  connectTimeoutMS: 60000,
  extra: {
    max: 100,
    idleTimeoutMillis: 30000
  }
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Conexão com o banco de dados PostgreSQL estabelecida com sucesso.");
    }
  } catch (error) {
    console.error("Erro crítico ao conectar ao banco de dados:", error);

    if (process.env.NODE_ENV === 'development') {
      console.error('Detalhes completos do erro:', JSON.stringify(error, null, 2));
    }

    process.exit(1);
  }
};

export const shutdownDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Conexão com o banco de dados encerrada com sucesso.");
    }
  } catch (error) {
    console.error("Erro ao encerrar conexão com o banco de dados:", error);
  }
};