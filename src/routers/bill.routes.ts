import { Router } from 'express';
import { container } from '../container/inversify.js';
import { uploadCsv, uploadPdf } from '../middlewares/fileUpload.js';
import { TYPES } from '../types/types.js';
import { BillController } from '../controller/BillController.js';
const router = Router();

const billController = container.get<BillController>(TYPES.Controllers.BillController);

/**
 * @swagger
 * /boletos:
 *   get:
 *     summary: Lista todos os boletos
 *     description: Retorna uma lista de todos os boletos, com opção de filtros e geração de relatório
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome do sacado
 *       - in: query
 *         name: valor_inicial
 *         schema:
 *           type: number
 *         description: Valor mínimo do boleto
 *       - in: query
 *         name: valor_final
 *         schema:
 *           type: number
 *         description: Valor máximo do boleto
 *       - in: query
 *         name: id_lote
 *         schema:
 *           type: integer
 *         description: ID do lote relacionado
 *       - in: query
 *         name: relatorio
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: Gerar relatório em PDF (1 = sim, 0 = não)
 *     responses:
 *       200:
 *         description: Lista de boletos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bill'
 *                 - $ref: '#/components/schemas/Report'
 *       500:
 *         description: Erro do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', (req, res, next) => {
  billController.findAll(req, res).catch(next);
});

/**
 * @swagger
 * /boletos/{id}:
 *   get:
 *     summary: Busca um boleto específico
 *     description: Retorna um boleto pelo seu ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do boleto
 *     responses:
 *       200:
 *         description: Boleto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       404:
 *         description: Boleto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res, next) => {
  billController.findById(req, res).catch(next);
});

/**
 * @swagger
 * /boletos/import-csv:
 *   post:
 *     summary: Importa boletos de um arquivo CSV
 *     description: Processa um arquivo CSV para importar boletos para o sistema
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo CSV com boletos
 *     responses:
 *       201:
 *         description: Boletos importados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *       400:
 *         description: Arquivo não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/import-csv', uploadCsv, (req, res, next) => {
  billController.importCsv(req, res).catch(next);
});

/**
 * @swagger
 * /boletos/process-pdf:
 *   post:
 *     summary: Processa um arquivo PDF com múltiplos boletos
 *     description: Recebe um PDF com múltiplas páginas de boletos e o divide em arquivos individuais
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo PDF com boletos
 *     responses:
 *       200:
 *         description: PDF processado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProcessedPdf'
 *       400:
 *         description: Arquivo não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/process-pdf', uploadPdf, (req, res, next) => {
  billController.processPdf(req, res).catch(next);
});

export default router;