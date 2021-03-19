import { EntityRepository, Repository } from "typeorm";
import { Cnaes } from "../models/Cnaes";

@EntityRepository(Cnaes)
class CnaesRepository extends Repository<Cnaes>{

}

export { CnaesRepository }