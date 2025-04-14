import { Router } from 'express';
import { container } from '../container/inversify.js';
import { TYPES } from '../types/types.js';
import { LotController } from '../controller/LotController.js';

const router = Router();

const lotController = container.get<LotController>(TYPES.Controllers.LotController);

/**
 * @swagger
 * /api/lotes:
 *   get:
 *     summary: Lista todos os lotes
 *     description: Retorna uma lista de todos os lotes ativos
 *     tags: [Lotes]
 *     responses:
 *       200:
 *         description: Lista de lotes encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lot'
 *       500:
 *         description: Erro do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', (req, res, next) => {
  lotController.findAll(req, res).catch(next);
});

/**
 * @swagger
 * /api/lotes/{id}:
 *   get:
 *     summary: Busca um lote específico
 *     description: Retorna um lote pelo seu ID
 *     tags: [Lotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do lote
 *     responses:
 *       200:
 *         description: Lote encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lot'
 *       404:
 *         description: Lote não encontrado
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
  lotController.findById(req, res).catch(next);
});

/**
 * @swagger
 * /api/lotes:
 *   post:
 *     summary: Cria um novo lote
 *     description: Cadastra um novo lote no sistema
 *     tags: [Lotes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do lote
 *               active:
 *                 type: boolean
 *                 description: Status de ativação do lote
 *                 default: true
 *     responses:
 *       201:
 *         description: Lote criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lot'
 *       500:
 *         description: Erro do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (req, res, next) => {
  lotController.create(req, res).catch(next);
});

/**
 * @swagger
 * /api/lotes/{id}:
 *   put:
 *     summary: Atualiza um lote existente
 *     description: Modifica um lote existente pelo seu ID
 *     tags: [Lotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do lote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do lote
 *               active:
 *                 type: boolean
 *                 description: Status de ativação do lote
 *     responses:
 *       200:
 *         description: Lote atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Lote não encontrado
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
router.put('/:id', (req, res, next) => {
  lotController.update(req, res).catch(next);
});

/**
 * @swagger
 * /api/lotes/{id}:
 *   delete:
 *     summary: Remove um lote
 *     description: Marca um lote como inativo (exclusão lógica)
 *     tags: [Lotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do lote
 *     responses:
 *       200:
 *         description: Lote removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Lote não encontrado
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
router.delete('/:id', (req, res, next) => {
  lotController.delete(req, res).catch(next);
});

export default router;