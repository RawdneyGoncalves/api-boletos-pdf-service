export class BoletoDTO {
   nome_sacado: string;
   id_lote: number;
   valor: number;
   linha_digitavel: string;
 
   constructor(nome_sacado: string, id_lote: number, valor: number, linha_digitavel: string) {
     this.nome_sacado = nome_sacado;
     this.id_lote = id_lote;
     this.valor = valor;
     this.linha_digitavel = linha_digitavel;
   }
 }
 