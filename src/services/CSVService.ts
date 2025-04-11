import * as fs from 'fs';
import * as csv from 'csv-parser';
import { BoletoRepository } from '../repository/BoletoRepository';
import { LoteRepository } from '../repository/LoteRepository';

export class CSVService {
  constructor(
    private boletoRepository: BoletoRepository,
    private loteRepository: LoteRepository
  ) {}

  async importarBoletos(file: string) {
    const dados = [];

    fs.createReadStream(file)
      .pipe(csv())
      .on('data', (row) => {
        dados.push(row);
      })
      .on('end', async () => {
        for (const dado of dados) {
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
      });
  }
}
