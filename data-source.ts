import { DataSource } from 'typeorm';
import { Boleto } from './src/entities/Boleto';
import { Lote } from './src/entities/Lote';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Boleto, Lote],
  migrations: ['container/migrations/*.ts'],
  synchronize: false,
});
