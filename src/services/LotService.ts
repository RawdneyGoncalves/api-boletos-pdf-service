import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types.js';
import { 
  ILot, 
  ILotRepository, 
  ILotService 
} from '../types/types.js';

@injectable()
export class LotService implements ILotService {
  constructor(
    @inject(TYPES.Repositories.LotRepository)
    private lotRepository: ILotRepository
  ) {}

  async findAll(): Promise<ILot[]> {
    return this.lotRepository.findAll();
  }

  async findById(id: number): Promise<ILot | null> {
    return this.lotRepository.findById(id);
  }

  async findByExactName(name: string): Promise<ILot | null> {
    return this.lotRepository.findByExactName(name);
  }

  async findByName(name: string): Promise<ILot | null> {
    return this.lotRepository.findByName(name);
  }

  async create(lot: ILot): Promise<ILot> {
    return this.lotRepository.create(lot);
  }

  async update(id: number, lot: Partial<ILot>): Promise<boolean> {
    return this.lotRepository.update(id, lot);
  }

  async delete(id: number): Promise<boolean> {
    return this.lotRepository.delete(id);
  }

  async findOrCreateByName(name: string): Promise<ILot> {
    let lot = await this.lotRepository.findByExactName(name);
    
    if (!lot) {
      const paddedName = name.padStart(4, '0');
      lot = await this.lotRepository.findByExactName(paddedName);
      
      if (!lot) {
        lot = await this.lotRepository.create({
          name: paddedName,
          active: true
        });
      }
    }
    
    return lot;
  }
}