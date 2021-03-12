import { EntityRepository, Repository } from "typeorm";
import { Motivo } from "../models/Motivo";

@EntityRepository(Motivo)
class MotivosRepository extends Repository<Motivo>{

}

export { MotivosRepository }