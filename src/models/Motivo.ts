import {Column, Entity, PrimaryColumn} from "typeorm"

@Entity("motivo")

class Motivo {
    @PrimaryColumn()
    codigoMotivo: number;

    @Column()
    descricaoMotivo: string;

}

export { Motivo }