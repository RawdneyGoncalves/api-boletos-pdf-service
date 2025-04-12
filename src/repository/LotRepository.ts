import { injectable } from "inversify";
import { Repository, Like } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { Lot } from "../entities/Lot.js";
import { 
  ILot, 
  ILotRepository 
} from "../types/types.js";

@injectable()
export class LotRepository implements ILotRepository {
  private repository: Repository<Lot>;
  
  constructor() {
    this.repository = AppDataSource.getRepository(Lot);
  }
  
  async findAll(): Promise<Lot[]> {
    return this.repository.find({
      where: {
        active: true
      }
    });
  }
  
  async findById(id: number): Promise<Lot | null> {
    return this.repository.findOne({
      where: {
        id,
        active: true
      }
    });
  }
  
  async findByExactName(name: string): Promise<Lot | null> {
    return this.repository.findOne({
      where: {
        name,
        active: true
      }
    });
  }
  
  async findByName(name: string): Promise<Lot | null> {
    return this.repository.findOne({
      where: {
        name: Like(`%${name}%`),
        active: true
      }
    });
  }
  
  async create(lot: ILot): Promise<Lot> {
    const newLot = this.repository.create(lot);
    return this.repository.save(newLot);
  }
  
  async update(id: number, lot: Partial<ILot>): Promise<boolean> {
    const result = await this.repository.update(id, lot);
    return result.affected ? result.affected > 0 : false;
  }
  
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.update(id, { active: false });
    return result.affected ? result.affected > 0 : false;
  }
}