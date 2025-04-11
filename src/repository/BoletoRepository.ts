import { EntityRepository, Repository } from 'typeorm';
import { Boleto } from '../entities/Boleto';

@EntityRepository(Boleto)
export class BoletoRepository extends Repository<Boleto> {}
