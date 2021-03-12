import { Request, Response } from 'express'
import { getCustomRepository } from "typeorm";
import { EmpresasRepository } from "../repository/EmpresasRepository"
import { MotivosRepository } from "../repository/MotivosRepository"
import { AppError } from '../errors/AppError';
import * as yup from 'yup';


class EmpresasController {
    async show(request: Request, response: Response) {

        const empresasRepository = getCustomRepository(EmpresasRepository);
        const motivosRepository = getCustomRepository(MotivosRepository);

        const { cnpj } = request.params
        const schema = yup.object().shape({
            cnpj: yup.string().required().min(14).max(14)
        })

        try {
            await schema.validate(request.params, { abortEarly: false })
        } catch (err) {
            throw new AppError(err)
        }

        const empresa = await empresasRepository.find({cnpj});
        if (!empresa) {
            throw new AppError("CNPJ não encontrado", 400)
        }


        async function getMotivo(codMotivo) {
            const motivo = await motivosRepository.findOne({ codigoMotivo: codMotivo })

            if (!motivo) {
                return ("Motivo não encontrado")
            } else {
                return motivo.descricaoMotivo
            }
        }

        await Promise.all(empresa.map(async (empresa) => {

            const situacao = await getMotivo(empresa.motivo_situacao)
            empresa.motivo_situacao = situacao
            
            if (empresa.matriz_filial == "1") {
                empresa.matriz_filial = "Matriz"
            } else {
                empresa.matriz_filial = "Filial"
            }

        }))

        return response.json(empresa)

    }
}

export { EmpresasController }