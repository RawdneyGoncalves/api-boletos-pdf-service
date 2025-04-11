import { BoletoRepository } from '../repository/BoletoRepository';
import { LoteRepository } from '../repository/LoteRepository';

export class BoletoService {
  constructor(
    private boletoRepository: BoletoRepository,
    private loteRepository: LoteRepository
  ) {}

  async importarBoletos(dadosCSV: any[]) {
    for (const dado of dadosCSV) {
      const lote = await this.loteRepository.findOne({
        where: { nome: dado.unidade },
      });

      if (lote) {
        await this.boletoRepository.save({
          nome_sacado: dado.nome,
          id_lote: lote.id,
          valor: parseFloat(dado.valor),
          linha_digitavel: dado.linha_digitavel,
        });
      }
    }
  }

  async listarBoletos(
    nome?: string,
    valor_inicial?: number,
    valor_final?: number,
    id_lote?: number
  ) {
    const where = {};

    if (nome) where.nome_sacado = nome;
    if (valor_inicial && valor_final) where.valor = { $between: [valor_inicial, valor_final] };
    if (id_lote) where.id_lote = id_lote;

    return await this.boletoRepository.find({
      where,
      relations: ['lote'],
    });
  }

  async gerarRelatorio(boletos: any[]) {
    // Implementação para gerar relatório em PDF
  }
}
