import { injectable, inject } from 'inversify';
import { TYPES, IBill, IBillFilter, IReportResult } from '../types/types';
import { BillRepository } from '../repository/BillRepository';
import { PDFService } from './PDFService';

@injectable()
export class BillService {
  constructor(
    @inject(TYPES.Repositories.BillRepository) private billRepository: BillRepository,
    @inject(TYPES.Services.PDFService) private pdfService: PDFService
  ) {}


  async findAll(filter?: IBillFilter): Promise<IBill[]> {
    return this.billRepository.findAll(filter);
  }


  async findById(id: number): Promise<IBill | null> {
    return this.billRepository.findById(id);
  }


  async create(bill: IBill): Promise<IBill> {
    return this.billRepository.create(bill);
  }


  async update(id: number, bill: Partial<IBill>): Promise<boolean> {
    return this.billRepository.update(id, bill);
  }


  async delete(id: number): Promise<boolean> {
    return this.billRepository.delete(id);
  }

  async generateReport(filter?: IBillFilter): Promise<IReportResult> {
    const bills = await this.billRepository.findAll(filter);
    
    if (bills.length === 0) {
      throw new Error('No bills found matching the filter criteria');
    }
    
    const base64 = await this.pdfService.generateBillReport(bills);
    
    return { base64 };
  }
}