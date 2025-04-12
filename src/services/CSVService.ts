import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { LotRepository } from '../repository/LotRepository';
import { BillRepository } from '../repository/BillRepository';
import { ICsvBill, IBill } from '../types/types';
import { parseCsvFile } from '../utils/csvUtils';
import { BillDTO } from '../dto/BillDTO';

@injectable()
export class CSVService {
  constructor(
    @inject(TYPES.Repositories.LotRepository) private lotRepository: LotRepository,
    @inject(TYPES.Repositories.BillRepository) private billRepository: BillRepository
  ) {}


  async processCsvFile(filePath: string): Promise<IBill[]> {
    try {
      const csvBills: ICsvBill[] = await parseCsvFile(filePath);
      
      const billsToCreate: IBill[] = [];
      
      for (const csvBill of csvBills) {
        const paddedUnit = csvBill.unit.padStart(4, '0');
        const lot = await this.lotRepository.findByExactName(paddedUnit);
        
        if (!lot) {
          throw new Error(`Lot not found for unit ${csvBill.unit}`);
        }
        
        billsToCreate.push({
          payeeName: csvBill.name,
          lotId: lot.id,
          amount: csvBill.amount,
          digitableLine: csvBill.digitableLine,
          active: true
        });
      }
      
      const createdBills = await this.billRepository.bulkCreate(billsToCreate);
      
      return createdBills.map(bill => new BillDTO(bill));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error processing CSV file: ${errorMessage}`);
    }
  }
}