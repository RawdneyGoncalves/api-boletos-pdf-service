export interface ILot {
    id?: number;
    name: string;
    active: boolean;
    createdAt?: Date;
  }
  

  export interface IBill {
    id?: number;
    payeeName: string;
    lotId: number;
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
    Services: {
      BillService: Symbol.for("BillService"),
      CSVService: Symbol.for("CSVService"),
      PDFService: Symbol.for("PDFService")
    },
    Repositories: {
      BillRepository: Symbol.for("BillRepository"),
      LotRepository: Symbol.for("LotRepository")
    },
    Controllers: {
      BillController: Symbol.for("BillController")
    }
  };