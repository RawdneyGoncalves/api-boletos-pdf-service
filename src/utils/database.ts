import { createConnection } from 'typeorm';
import 'dotenv/config';

export async function conectarBanco() {
  await createConnection({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'test',
    entities: ['src/entities/*.ts'],
    synchronize: true,
  });
}
