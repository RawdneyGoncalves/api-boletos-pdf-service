export interface ILot {
  id?: number;
  name: string;
  active: boolean;
  createdAt?: Date;
  bills?: IBill[];
}

export interface IBill {
  id?: number;
  payeeName: string;
  lotId: number;
  lot?: ILot;
  amount: number;
  digitableLine: string;
  active: boolean;
  createdAt?: Date;
}

export interface ICsvBill {
  name: string;
  unit: string;
  amount: number;
  digitableLine: string;
}

export interface IBillFilter {
  name?: string;
  minAmount?: number;
  maxAmount?: number;
  lotId?: number;
  generateReport?: number;
}

export interface IPdfPage {
  pageNumber: number;
  content: string;
}

export interface IProcessedPdf {
  files: string[];
}

export interface IReportResult {
  base64: string;
}

export const TYPES = {
  Repositories: {
    LotRepository: Symbol.for('LotRepository'),
    BillRepository: Symbol.for('BillRepository')
  },
  Services: {
    LotService: Symbol.for('LotService'),
    BillService: Symbol.for('BillService'),
    CSVService: Symbol.for('CSVService'),
    PDFService: Symbol.for('PDFService')
  },
  Controllers: {
    LotController: Symbol.for('LotController'),
    BillController: Symbol.for('BillController')
  }
};

export interface ILotRepository {
  findAll(): Promise<ILot[]>;
  findById(id: number): Promise<ILot | null>;
  findByExactName(name: string): Promise<ILot | null>;
  findByName(name: string): Promise<ILot | null>;
  create(lot: ILot): Promise<ILot>;
  update(id: number, lot: Partial<ILot>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}

export interface IBillRepository {
  findAll(filter?: IBillFilter): Promise<IBill[]>;
  findById(id: number): Promise<IBill | null>;
  bulkCreate(bills: IBill[]): Promise<IBill[]>;
  create(bill: IBill): Promise<IBill>;
  update(id: number, bill: Partial<IBill>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}

export interface ILotService {
  findAll(): Promise<ILot[]>;
  findById(id: number): Promise<ILot | null>;
  findByExactName(name: string): Promise<ILot | null>;
  findByName(name: string): Promise<ILot | null>;
  create(lot: ILot): Promise<ILot>;
  update(id: number, lot: Partial<ILot>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findOrCreateByName(name: string): Promise<ILot>;
}

export interface IBillService {
  findAll(filter?: IBillFilter): Promise<IBill[]>;
  findById(id: number): Promise<IBill | null>;
  create(bill: IBill): Promise<IBill>;
  update(id: number, bill: Partial<IBill>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  generateReport(filter?: IBillFilter): Promise<IReportResult>;
}

export interface ICSVService {
  processCsvFile(filePath: string): Promise<IBill[]>;
}

export interface IPDFService {
  processPdfFile(filePath: string): Promise<string[]>;
  generateBillReport(bills: IBill[]): Promise<string>;
}