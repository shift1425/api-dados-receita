import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Cnaes1616288428799 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(
            new Table({
                name:"cnaes",
                columns:[
                    {
                        name:"cnaes_id",
                        type: "integer",
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name:"cnpj",
                        type: "string",
                    },
                    {
                        name:"cnae_ordem",
                        type: "integer",
                    },
                    {
                        name:"cnae",
                        type: "string",
                    },
                    {
                        name:"descricao_cnae",
                        type: "string",
                    },
                    {
                        name:"empresas_id",
                        type: "string",
                    }

                ],
                foreignKeys: [
                    {
                        name: 'EmpresasCnaes',
                        columnNames: ['empresas_id'],
                        referencedTableName: 'empresas',
                        referencedColumnNames: ['empresas_id'],
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    }
                ]

            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable("cnaes")
    }

}
