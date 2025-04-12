import { inject, injectable } from 'inversify';
import fs from 'fs';
import csv from 'csv-parser';
import { TYPES, IBill } from '../types/types.js';
import { BillRepository } from '../repository/BillRepository.js';
import { LotService } from './LotService.js';
import { CsvBillDTO } from '../dto/BillDTO.js';

@injectable()
export class CSVService {
  constructor(
    @inject(TYPES.Repositories.BillRepository)
    private billRepository: BillRepository,
    @inject(TYPES.Services.LotService)
    private lotService: LotService
  ) {}

  async processCsvFile(filePath: string): Promise<IBill[]> {
    const csvData: CsvBillDTO[] = await this.readCsvFile(filePath);
    
    const billsToCreate: IBill[] = [];
    
    for (const csvBill of csvData) {
      const lot = await this.lotService.findOrCreateByName(csvBill.unit);
      
      if (!lot) {
        throw new Error(`Could not find or create lot for unit: ${csvBill.unit}`);
      }
      
      if (lot.id === undefined) {
        throw new Error(`Lot found for unit ${csvBill.unit} has undefined id`);
      }
      
      billsToCreate.push({
        payeeName: csvBill.name,
        lotId: lot.id,
        amount: csvBill.amount,
        digitableLine: csvBill.digitableLine,
        active: true
      });
    }
    
    return this.billRepository.bulkCreate(billsToCreate);
  }

  private readCsvFile(filePath: string): Promise<CsvBillDTO[]> {
    return new Promise((resolve, reject) => {
      const results: CsvBillDTO[] = [];
      
      fs.createReadStream(filePath, { encoding: 'utf-8' })
        .pipe(csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim()
        }))
        .on('data', (data) => {
          results.push(new CsvBillDTO(data));
        })
        .on('end', () => {
          fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting CSV file:', err);
          });
          
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}