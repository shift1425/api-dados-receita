import { Request, Response } from 'express'
import { getCustomRepository } from "typeorm";
import { EmpresasRepository } from "../repository/EmpresasRepository"
import { MotivosRepository } from "../repository/MotivosRepository"
import { AppError } from '../errors/AppError';
import * as yup from 'yup';
import { CnaesRepository } from '../repository/CnaesRepository';
import ConsultaCnaeIbge from '../services/ConsultaCnaeIbge';


class EmpresasController {
    async show(request: Request, response: Response) {
        
        const empresasRepository = getCustomRepository(EmpresasRepository);
        const motivosRepository = getCustomRepository(MotivosRepository);
        const cnaesRepository = getCustomRepository(CnaesRepository)

        const { cnpj } = request.params
        const schema = yup.object().shape({
            cnpj: yup.string()
            .min(14,"CNPJ INVÁLIDO, VERIFIQUE O CNPJ INFORMADO E TENTE NOVAMENTE")
            .max(14,"CNPJ INVÁLIDO, VERIFIQUE O CNPJ INFORMADO E TENTE NOVAMENTE")
            .required("POR FAVOR INFORME O NUMERO DO CNPJ")
        })

        try {
            await schema.validate(request.params, { abortEarly: false })
        } catch (err) {
            throw new AppError(err.message,404)
        }

        const empresa = await empresasRepository.find({cnpj});
        if (!empresa) {
            throw new AppError("CNPJ não encontrado", 400)
        }

        const cnaes_secundarios = await cnaesRepository.find({cnpj});

        async function getMotivo(codMotivo) {
            const motivo = await motivosRepository.findOne({ codigoMotivo: codMotivo })

            if (!motivo) {
                return ("Motivo não encontrado")
            } else {
                return motivo.descricaoMotivo
            }
        }
        await Promise.all(cnaes_secundarios.map(async (cnaes_secundarios) => {
            const cnae = cnaes_secundarios.cnae
            const descricao = await ConsultaCnaeIbge(cnae)
            cnaes_secundarios.cnae = cnae + "-" + descricao
            console.log(cnaes_secundarios.cnae)
            
        }))

        await Promise.all(empresa.map(async (empresa) => {

            const situacao = await getMotivo(empresa.motivo_situacao)
            empresa.motivo_situacao = situacao
            
            if (empresa.matriz_filial == "1") {
                empresa.matriz_filial = "Matriz"
            } else {
                empresa.matriz_filial = "Filial"
            }
        }))


        return response.render("index",{empresa: empresa})
        // return response.json(empresa)

    }
}

export { EmpresasController }