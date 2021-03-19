import {Column, Entity, PrimaryColumn} from "typeorm"

@Entity("cnaes")

class Cnaes {
    @PrimaryColumn()
    id: number;

    @Column()
    cnpj: string;

    @Column()
    cnae_ordem: number;

    @Column()
    cnae: string;

}

export { Cnaes }