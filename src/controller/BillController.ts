import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../types/types.js';
import { BillService } from '../services/BillService.js';
import { CSVService } from '../services/CSVService.js';
import { PDFService } from '../services/PDFService.js';
import { BillFilterDTO } from '../dto/BillDTO.js';

@injectable()
export class BillController {
  constructor(
    @inject(TYPES.Services.BillService) private billService: BillService,
    @inject(TYPES.Services.CSVService) private csvService: CSVService,
    @inject(TYPES.Services.PDFService) private pdfService: PDFService
  ) {}

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const filter = new BillFilterDTO(req.query);
      
      if (filter.generateReport === 1) {
        const report = await this.billService.generateReport(filter);
        return res.json(report);
      }
      
      const bills = await this.billService.findAll(filter);
      return res.json(bills);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ error: `Error retrieving bills: ${errorMessage}` });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const bill = await this.billService.findById(id);
      
      if (!bill) {
        return res.status(404).json({ error: 'Bill not found' });
      }
      
      return res.json(bill);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ error: `Error retrieving bill: ${errorMessage}` });
    }
  }

  async importCsv(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No CSV file provided' });
      }
      
      const bills = await this.csvService.processCsvFile(req.file.path);
      return res.status(201).json(bills);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ error: `Error importing CSV file: ${errorMessage}` });
    }
  }

  async processPdf(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file provided' });
      }
      
      const pdfPaths = await this.pdfService.processPdfFile(req.file.path);
      return res.json({ files: pdfPaths });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ error: `Error processing PDF file: ${errorMessage}` });
    }
  }
}