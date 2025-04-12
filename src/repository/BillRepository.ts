import { injectable } from "inversify";
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, Like, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../config/database";
import { Bill } from "../entities/Bill";
import { IBill, IBillFilter } from "../types/types";

@injectable()
export class BillRepository {
  private repository: Repository<Bill>;

  constructor() {
    this.repository = AppDataSource.getRepository(Bill);
  }


  async findAll(filter?: IBillFilter): Promise<Bill[]> {
    const where: FindOptionsWhere<Bill> = {
      active: true
    };

    if (filter) {
      if (filter.name) {
        where.payeeName = Like(`%${filter.name}%`);
      }

      if (filter.lotId) {
        where.lotId = filter.lotId;
      }

      if (filter.minAmount && filter.maxAmount) {
        where.amount = Between(filter.minAmount, filter.maxAmount);
      } else if (filter.minAmount) {
        where.amount = MoreThanOrEqual(filter.minAmount);
      } else if (filter.maxAmount) {
        where.amount = LessThanOrEqual(filter.maxAmount);
      }
    }

    return this.repository.find({
      where,
      relations: ["lot"],
      order: {
        id: "ASC"
      }
    });
  }


  async findById(id: number): Promise<Bill | null> {
    return this.repository.findOne({
      where: {
        id,
        active: true
      },
      relations: ["lot"]
    });
  }


  async bulkCreate(bills: IBill[]): Promise<Bill[]> {
    const newBills = this.repository.create(bills);
    return this.repository.save(newBills);
  }


  async create(bill: IBill): Promise<Bill> {
    const newBill = this.repository.create(bill);
    return this.repository.save(newBill);
  }


  async update(id: number, bill: Partial<IBill>): Promise<boolean> {
    const result = await this.repository.update(id, bill);
    return result.affected ? result.affected > 0 : false;
  }


  async delete(id: number): Promise<boolean> {
    const result = await this.repository.update(id, { active: false });
    return result.affected ? result.affected > 0 : false;
  }
}