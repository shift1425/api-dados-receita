import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import { Empresas } from "./Empresas";


@Entity("cnaes")

class Cnaes {
    @PrimaryGeneratedColumn("increment")
    cnaes_id: number;

    @Column()
    cnpj: string;

    @Column()
    cnae_ordem: number;

    @Column()
    cnae: string;

    @Column()
    descricao_cnae: string;

    @ManyToOne( () => Empresas, empresa => empresa.cnaes)
    @JoinColumn({ name: 'empresas_id'})
    empresas: Empresas;
}

export { Cnaes }