import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lote } from './Lote';

@Entity()
export class Boleto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome_sacado: string;

  @ManyToOne(() => Lote, { eager: true }) // eager para carregar o lote junto automaticamente
  @JoinColumn({ name: 'id_lote' })
  lote: Lote;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column()
  linha_digitavel: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  criado_em: Date;
}