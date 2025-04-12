import { injectable, inject } from 'inversify';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import PDFParse from 'pdf-parse';
import PDFKit from 'pdfkit';
import { TYPES, IBill } from '../types/types.js';
import { BillRepository } from '../repository/BillRepository.js';

@injectable()
export class PDFService {
  private outputDir: string;
  
  constructor(
    @inject(TYPES.Repositories.BillRepository) private billRepository: BillRepository
  ) {
    this.outputDir = process.env.OUTPUT_DIR || './output';
    
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async processPdfFile(filePath: string): Promise<string[]> {
    try {
      const pdfBuffer = fs.readFileSync(filePath);

      const pdfDoc = await PDFDocument.load(pdfBuffer);

      const bills = await this.billRepository.findAll();
      
      if (bills.length === 0) {
        throw new Error('No bills found in the database to match with PDF pages');
      }
      
      // Check if the number of pages matches the number of bills
      if (pdfDoc.getPageCount() !== bills.length) {
        throw new Error(`Number of PDF pages (${pdfDoc.getPageCount()}) does not match number of bills (${bills.length})`);
      }
      
      // For this implementation, we assume the PDF pages are in a specific order:
      // MARCIA, JOSE, MARCOS (as specified in the problem statement)
      // We need to map them to bills in database order: JOSE (id 1), MARCOS (id 2), MARCIA (id 3)
      
      // Define the expected order of bills in the PDF
      // This is a fixed order that must match what the client specified
      const pdfOrder = ['MARCIA CARVALHO', 'JOSE DA SILVA', 'MARCOS ROBERTO'];
      
      // Create a mapping from PDF page number to bill ID
      const pageToIdMap = new Map<number, number>();
      
      // Assign each bill ID to the correct PDF page
      for (let i = 0; i < pdfOrder.length; i++) {
        const expectedName = pdfOrder[i];
        // Find the bill with this name
        const matchingBill = bills.find(bill => 
          bill.payeeName.toUpperCase() === expectedName.toUpperCase()
        );
        
        if (!matchingBill) {
          throw new Error(`Could not find bill for name: ${expectedName}`);
        }
        
        // Map this page number to the bill ID
        pageToIdMap.set(i, matchingBill.id);
      }
      
      // Create individual PDF files for each page
      const outputPaths: string[] = [];
      
      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const billId = pageToIdMap.get(i);
        
        if (!billId) {
          continue; // Skip if no bill ID is mapped to this page
        }
        
        // Create a new PDF with just this page
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        
        // Save the new PDF with the bill ID as filename
        const outputPath = path.resolve(this.outputDir, `${billId}.pdf`);
        const pdfBytes = await newPdf.save();
        fs.writeFileSync(outputPath, pdfBytes);
        
        outputPaths.push(outputPath);
      }
      
      // Delete the original file after processing
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting PDF file:', err);
      });
      
      return outputPaths;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw error;
    }
  }

  async generateBillReport(bills: IBill[]): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFKit({ margin: 50 });
        
        // Set up the document
        doc.fontSize(20).text('Bill Report', { align: 'center' });
        doc.moveDown();
        
        // Create table headers
        const headers = ['ID', 'Nome Sacado', 'ID Lote', 'Valor', 'Linha Digitável'];
        const rowHeight = 30;
        const columnWidths = [40, 150, 40, 80, 180];
        const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
        const startX = (doc.page.width - tableWidth) / 2;
        
        // Draw table header
        doc.fontSize(12).font('Helvetica-Bold');
        let currentX = startX;
        
        for (let i = 0; i < headers.length; i++) {
          doc.rect(currentX, doc.y, columnWidths[i], rowHeight).stroke();
          doc.text(headers[i], currentX + 5, doc.y + 10, { width: columnWidths[i] - 10 });
          currentX += columnWidths[i];
        }
        
        doc.moveDown();
        
        // Draw table rows
        doc.font('Helvetica');
        
        for (const bill of bills) {
          currentX = startX;
          const rowData = [
            bill.id?.toString() || '',
            bill.payeeName,
            bill.lotId.toString(),
            bill.amount.toFixed(2),
            bill.digitableLine
          ];
          
          const rowY = doc.y;
          
          for (let i = 0; i < rowData.length; i++) {
            doc.rect(currentX, rowY, columnWidths[i], rowHeight).stroke();
            doc.text(rowData[i], currentX + 5, rowY + 10, { width: columnWidths[i] - 10 });
            currentX += columnWidths[i];
          }
          
          doc.y = rowY + rowHeight;
        }
        
        const chunks: Buffer[] = [];
        
        doc.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          const base64 = pdfBuffer.toString('base64');
          resolve(base64);
        });
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}