import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import PDFParse from 'pdf-parse';
import PDFKit from 'pdfkit';
import { IBill, IPdfPage } from '../types/types';


export const extractPdfInfo = async (filePath: string): Promise<IPdfPage[]> => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await PDFParse(dataBuffer);
  
  const pages: IPdfPage[] = [];
  
  const pageTexts = pdfData.text.split('\n\n\n');
  
  for (let i = 0; i < pdfData.numpages; i++) {
    pages.push({
      pageNumber: i + 1,
      content: pageTexts[i] || `Content of page ${i + 1}`
    });
  }
  
  return pages;
};


export const splitPdf = async (inputPath: string, outputDir: string): Promise<string[]> => {
  const pdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const outputPaths: string[] = [];
  
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(page);
    
    const outputPath = path.join(outputDir, `${i + 1}.pdf`);
    const newPdfBytes = await newPdf.save();
    
    fs.writeFileSync(outputPath, newPdfBytes);
    outputPaths.push(outputPath);
  }
  
  return outputPaths;
};


export const generateReport = (bills: IBill[]): Promise<Buffer> => {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    const doc = new PDFKit();
    
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(18).text('Bill Report', {
      align: 'center'
    });
    
    doc.moveDown(2);
    
    const tableTop = 150;
    
    doc.fontSize(12);
    doc.text('ID', 50, tableTop);
    doc.text('Payee Name', 100, tableTop);
    doc.text('Lot ID', 300, tableTop);
    doc.text('Amount', 380, tableTop);
    doc.text('Digitable Line', 450, tableTop);
    
    doc.moveTo(50, tableTop + 20)
       .lineTo(550, tableTop + 20)
       .stroke();
    
    let y = tableTop + 40;
    
    bills.forEach((bill) => {
      doc.fontSize(10);
      doc.text(String(bill.id), 50, y);
      doc.text(bill.payeeName, 100, y, { width: 180 });
      doc.text(String(bill.lotId), 300, y);
      doc.text(`R$ ${bill.amount.toFixed(2)}`, 380, y);
      doc.text(bill.digitableLine, 450, y, { width: 100 });
      
      y += 30;
      
      // New page if needed
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
    });
    
    doc.end();
  });
};


export const createFakePdf = (outputPath: string, names: string[]): void => {
  const doc = new PDFKit();
  const stream = fs.createWriteStream(outputPath);
  
  doc.pipe(stream);
  
  names.forEach((name, index) => {
    if (index > 0) {
      doc.addPage();
    }
    
    doc.fontSize(20).text(`BILL FOR ${name}`, {
      align: 'center'
    });
    
    doc.moveDown(2);
    
    doc.fontSize(14).text(`This is a sample bill for ${name}`, {
      align: 'center'
    });
    
    doc.moveDown();
    
    doc.fontSize(12).text(`Page ${index + 1} of ${names.length}`);
  });
  
  doc.end();
};