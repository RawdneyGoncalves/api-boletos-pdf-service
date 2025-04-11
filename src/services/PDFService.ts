import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';

export class PDFService {
  async distribuirBoletosPDF(file: string) {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(file));
    const numPages = pdfDoc.getPages().length;

    for (let i = 0; i < numPages; i++) {
      const page = pdfDoc.getPages()[i];
      const fileName = `${i + 1}.pdf`;
      const newPdfDoc = await PDFDocument.create();
      newPdfDoc.addPage(page);
      const pdfBytes = await newPdfDoc.save();
      fs.writeFileSync(`./output/${fileName}`, pdfBytes);
    }
  }
}
