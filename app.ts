import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import 'reflect-metadata';
import billRoutes from './src/routers/bill.routes.js';
import lotRoutes from './src/routers/lot.routes.js';
import { swaggerSpec, swaggerUi } from './src/config/swagger.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const outputDir = process.env.OUTPUT_DIR || './output';

app.use('/uploads', express.static(path.resolve(uploadDir)));
app.use('/output', express.static(path.resolve(outputDir)));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API de Gerenciamento de Boletos - Documentação'
}));

app.use('/api/boletos', billRoutes);
app.use('/api/lotes', lotRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API para gerenciamento de boletos e lotes',
    documentation: '/api-docs'
  });
});

export default app;