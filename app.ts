import 'reflect-metadata';
import express from 'express';
import { conectarBanco } from './src/utils/database';
import boletoRoutes from './src/routers/boletoRoutes';
import 'dotenv/config';

const app = express();
app.use(express.json());

const port = parseInt(process.env.SERVER_PORT || '3000', 10);

conectarBanco().then(() => {
  app.use('/boletos', boletoRoutes);

  app.listen(port, () => {
    console.log(`🚀 Servidor rodando em: \x1b[36mhttp://localhost:${port}\x1b[0m`);
  });
}).catch((err) => {
  console.error('❌ Erro ao conectar com o banco de dados:', err);
});
