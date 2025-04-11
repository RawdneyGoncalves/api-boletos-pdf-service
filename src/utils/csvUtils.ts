import * as fs from 'fs';
import * as csv from 'csv-parser';

export async function lerCSV(file: string) {
  const dados = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', (row) => {
        dados.push(row);
      })
      .on('end', () => {
        resolve(dados);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
