import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../types/types';
import { BillService } from '../services/BillService';
import { CSVService } from '../services/CSVService';
import { PDFService } from '../services/PDFService';
import { BillFilterDTO } from '../dto/BillDTO';

@injectable()
export class BillController {
  constructor(
    @inject(TYPES.Services.BillService) private billService: BillService,
    @inject(TYPES.Services.CSVService) private csvService: CSVService,
    @inject(TYPES.Services.PDFService) private pdfService: PDFService
  ) {}

  /**
   * Get all bills with optional filters
   * @param req Express request object
   * @param res Express response object
   */
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const filter = new BillFilterDTO(req.query);
      
      // Check if report generation is requested
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

  /**
   * Get bill by ID
   * @param req Express request object
   * @param res Express response object
   */
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

  /**
   * Import bills from CSV file
   * @param req Express request object
   * @param res Express response object
   */
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

  /**
   * Process PDF file, splitting it into individual bills
   * @param req Express request object
   * @param res Express response object
   */
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