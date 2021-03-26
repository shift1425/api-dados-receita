import { Request, Response } from 'express'
import { getConnection, getCustomRepository } from "typeorm";
import { EmpresasRepository } from "../repository/EmpresasRepository"
import { AppError } from '../errors/AppError';
import { Empresas } from '../models/Empresas';

class Controller {

    async create(request: Request, response: Response){
        function mask(value, pattern) {
            let i = 0;
            const v = value.toString()
            return pattern.replace(/#/g, ()=> v[i++] ||'')
        }
        const empresasRepository = getCustomRepository(EmpresasRepository);
        const empresas = await empresasRepository.find()
        
        await Promise.all(empresas.map(async (empresa) => {
            let data = mask(empresa.data_situacao,'####-##-##')
           
            empresa.data_situacao = new Date(data)
            console.log(empresa.data_situacao)
            await getConnection()
            .createQueryBuilder()
            .update(Empresas)
            .set({ data_situacao: empresa.data_situacao })
            .where("empresas_id = :id", { id: empresa.empresas_id })
            .execute();
        }))


        return response.status(201).render("success");

    }

}

export { Controller }