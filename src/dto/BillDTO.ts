import { IBill, IBillFilter, ICsvBill } from "../types/types.js";



export class BillDTO implements IBill {
  id?: number;
  payeeName: string;
  lotId: number;
  amount: number;
  digitableLine: string;
  active: boolean;
  createdAt?: Date;

  constructor(data: IBill) {
    this.id = data.id;
    this.payeeName = data.payeeName;
    this.lotId = data.lotId;
    this.amount = data.amount;
    this.digitableLine = data.digitableLine;
    this.active = data.active;
    this.createdAt = data.createdAt;
  }
}


export class BillFilterDTO implements IBillFilter {
  name?: string;
  minAmount?: number;
  maxAmount?: number;
  lotId?: number;
  generateReport?: number;

  constructor(query: any) {
    this.name = query.nome;
    this.minAmount = query.valor_inicial ? parseFloat(query.valor_inicial) : undefined;
    this.maxAmount = query.valor_final ? parseFloat(query.valor_final) : undefined;
    this.lotId = query.id_lote ? parseInt(query.id_lote) : undefined;
    this.generateReport = query.relatorio ? parseInt(query.relatorio) : undefined;
  }
}


export class CsvBillDTO implements ICsvBill {
  name: string;
  unit: string;
  amount: number;
  digitableLine: string;

  constructor(data: any) {
    this.name = data.nome;
    this.unit = data.unidade;
    this.amount = typeof data.valor === "string" 
      ? parseFloat(data.valor.replace(",", ".")) 
      : data.valor;
    this.digitableLine = data.linha_digitavel;
  }
}