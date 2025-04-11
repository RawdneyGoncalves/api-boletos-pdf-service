import express from 'express';
import { BoletoController } from '../controller/BoletoController';
import { fileUpload } from '../middlewares/fileUpload';
import { CSVService } from '../services/CSVService';
import { PDFService } from '../services/PDFService';

const router = express.Router();
const boletoController = new BoletoController(
  new CSVService(null, null),
  new PDFService()
);

router.post('/importar-boletos', fileUpload.single('file'), boletoController.importarBoletos);
router.post('/distribuir-boletos-pdf', fileUpload.single('file'), boletoController.distribuirBoletosPDF);
router.get('/boletos', boletoController.listarBoletos);
router.get('/boletos/relatorio', boletoController.gerarRelatorio);

export default router;
