import { EntityRepository, Repository } from 'typeorm';
import { Lote } from '../entities/Lote';

@EntityRepository(Lote)
export class LoteRepository extends Repository<Lote> {}
