import express, { Request, Response, NextFunction, Application } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';
import 'reflect-metadata';
import billRoutes from './src/routers/bill.routes.js';
import lotRoutes from './src/routers/lot.routes.js';
import { setupSwagger } from './src/config/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const outputDir = process.env.OUTPUT_DIR || './output';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

app.use('/uploads', express.static(path.resolve(uploadDir)));
app.use('/output', express.static(path.resolve(outputDir)));

setupSwagger(app);

app.use('/api/boletos', billRoutes);
app.use('/api/lotes', lotRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
    sugestão: 'Consulte a documentação em /api-docs'
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro interno'
  });
});

export default app;