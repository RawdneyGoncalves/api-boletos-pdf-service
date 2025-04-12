import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lot } from './Lot.js';


@Entity('boleto')
export class Bill {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({ name: 'nome_sacado' })
  declare payeeName: string;

  @Column({ name: 'id_lote' })
  declare lotId: number;

  @ManyToOne(() => Lot, { eager: true })
  @JoinColumn({ name: 'id_lote' })
  declare lot: Lot;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  declare amount: number;

  @Column({ name: 'linha_digitavel' })
  declare digitableLine: string;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  declare active: boolean;

  @Column({ name: 'criado_em', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;
}