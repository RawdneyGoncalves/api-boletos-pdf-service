import fs from 'fs';
import csvParser from 'csv-parser';
import { ICsvBill } from '../types/types';

export const parseCsvFile = async (filePath: string): Promise<ICsvBill[]> => {
  const results: ICsvBill[] = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ';' }))
      .on('data', (data) => {
        results.push({
          name: data.nome,
          unit: data.unidade,
          amount: parseFloat(data.valor.replace(',', '.')),
          digitableLine: data.linha_digitavel
        });
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};