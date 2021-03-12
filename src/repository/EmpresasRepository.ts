import { EntityRepository, Repository } from "typeorm";
import { Empresas } from "../models/Empresas";

@EntityRepository(Empresas)
class EmpresasRepository extends Repository<Empresas>{

}

export { EmpresasRepository }