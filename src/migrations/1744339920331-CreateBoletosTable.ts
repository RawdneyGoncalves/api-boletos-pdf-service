import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBoletosTable1744339920331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'boleto',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nome_sacado',
            type: 'varchar',
          },
          {
            name: 'id_lote',
            type: 'int',
          },
          {
            name: 'valor',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'linha_digitavel',
            type: 'varchar',
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'criado_em',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'boleto',
      new TableForeignKey({
        columnNames: ['id_lote'],
        referencedTableName: 'lote',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('boleto');
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.includes('id_lote'));
    if (foreignKey) {
      await queryRunner.dropForeignKey('boleto', foreignKey);
    }
    await queryRunner.dropTable('boleto');
  }
}
