import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types/types.js';

import { LotRepository } from '../repository/LotRepository.js';
import { BillRepository } from '../repository/BillRepository.js';

import { LotService } from '../services/LotService.js';
import { BillService } from '../services/BillService.js';
import { CSVService } from '../services/CSVService.js';
import { PDFService } from '../services/PDFService.js';

import { LotController } from '../controller/LotController.js';
import { BillController } from '../controller/BillController.js';

import { 
  ILotRepository, 
  IBillRepository, 
  ILotService, 
  IBillService, 
  ICSVService, 
  IPDFService 
} from '../types/types.js';

const container = new Container({
  defaultScope: 'Singleton'
});

container.bind<ILotRepository>(TYPES.Repositories.LotRepository)
  .to(LotRepository)
  .inSingletonScope();

container.bind<IBillRepository>(TYPES.Repositories.BillRepository)
  .to(BillRepository)
  .inSingletonScope();

container.bind<ILotService>(TYPES.Services.LotService)
  .to(LotService)
  .inSingletonScope();

container.bind<IBillService>(TYPES.Services.BillService)
  .to(BillService)
  .inSingletonScope();

container.bind<ICSVService>(TYPES.Services.CSVService)
  .to(CSVService)
  .inSingletonScope();

container.bind<IPDFService>(TYPES.Services.PDFService)
  .to(PDFService)
  .inSingletonScope();

container.bind(TYPES.Controllers.LotController)
  .to(LotController)
  .inSingletonScope();

container.bind(TYPES.Controllers.BillController)
  .to(BillController)
  .inSingletonScope();

export { container };