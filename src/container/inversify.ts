import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types/types';

import { LotRepository } from '../repository/LotRepository.js';
import { BillRepository } from '../repository/BillRepository.js';

import { BillService } from '../services/BillService';
import { CSVService } from '../services/CSVService';
import { PDFService } from '../services/PDFService';

import { BillController } from '../controller/BillController.js';

const container = new Container();

container.bind(TYPES.Repositories.LotRepository).to(LotRepository).inSingletonScope();
container.bind(TYPES.Repositories.BillRepository).to(BillRepository).inSingletonScope();

container.bind(TYPES.Services.BillService).to(BillService).inSingletonScope();
container.bind(TYPES.Services.CSVService).to(CSVService).inSingletonScope();
container.bind(TYPES.Services.PDFService).to(PDFService).inSingletonScope();

container.bind(TYPES.Controllers.BillController).to(BillController).inSingletonScope();

export { container };