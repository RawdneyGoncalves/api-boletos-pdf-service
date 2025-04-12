import { injectable, inject } from 'inversify';
import fs from 'fs';
import path from 'path';
import { TYPES, IBill } from '../types/types';
import { BillRepository } from '../repository/BillRepository';
import { splitPdf, generateReport } from '../utils/pdfUtils';

@injectable()
export class PDFService {
  constructor(
    @inject(TYPES.Repositories.BillRepository) private billRepository: BillRepository
  ) {}


  async processPdfFile(filePath: string): Promise<string[]> {
    try {
      const bills = await this.billRepository.findAll();
      
      if (bills.length === 0) {
        throw new Error('No registered bills to process PDF');
      }
      
      const outputDir = process.env.OUTPUT_DIR || './output';
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const splitPaths = await splitPdf(filePath, outputDir);
      
      const renamedPaths: string[] = [];
      
      const billIds = bills.map(b => b.id).reverse();
      
      for (let i = 0; i < splitPaths.length && i < billIds.length; i++) {
        const oldPath = splitPaths[i];
        const newPath = path.join(outputDir, `${billIds[i]}.pdf`);
        
        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
          renamedPaths.push(newPath);
        }
      }
      
      return renamedPaths;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error processing PDF file: ${errorMessage}`);
    }
  }


  async generateBillReport(bills: IBill[]): Promise<string> {
    try {
      const pdfBuffer = await generateReport(bills);
      return pdfBuffer.toString('base64');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error generating report: ${errorMessage}`);
    }
  }
}