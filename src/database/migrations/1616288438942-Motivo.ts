import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Motivo1616288438942 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:"motivo",
                columns: [
                    {
                        name:"codigoMotivo",
                        type:"integer",
                        isPrimary: true,
                    },
                    {
                        name:"descricaoMotivo",
                        type:"varchar",
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("motivo")
    }

}
