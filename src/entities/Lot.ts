import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Bill } from './Bill';


@Entity('lote')
export class Lot {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({ name: 'nome' })
  declare name: string;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  declare active: boolean;

  @Column({ name: 'criado_em', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @OneToMany(() => Bill, (bill) => bill.lot)
  declare bills?: Bill[];
}