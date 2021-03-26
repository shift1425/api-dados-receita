import { Request, Response } from 'express'
import { getConnection, getCustomRepository } from "typeorm";
import { EmpresasRepository } from "../repository/EmpresasRepository"
import { MotivosRepository } from "../repository/MotivosRepository"
import { AppError } from '../errors/AppError';
import * as yup from 'yup';
import { Empresas } from '../models/Empresas';
import ConsultaCnaeIbge from '../services/ConsultaCnaeIbge'



class EmpresasController {
    async show(request: Request, response: Response) {

        const empresasRepository = getCustomRepository(EmpresasRepository);
        const motivosRepository = getCustomRepository(MotivosRepository);

        const  {cnpj} = request.params
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

        const cnpjs = await getConnection().createQueryBuilder()
        .select("empresas_id")
        .from(Empresas, "empresas")
        .where("empresas.cnpj=:cnpj",{ cnpj: cnpj }).getRawMany();

        const empresa = await empresasRepository.findByIds(cnpjs, {relations: ['cnaes']});
        if (empresa.length === 0) {
            throw new AppError("CNPJ não encontrado, verifique e tente novamente!", 404)
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
            await Promise.all(empresa.cnaes.map(async (cnaes) => {
                const cnae = cnaes.cnae.substring(0,5)
                cnaes.descricao_cnae = await ConsultaCnaeIbge(cnae)
                console.log(cnaes.descricao_cnae)
            }))
        }))

        return response.render("cnpj",{empresa: empresa}, )
        // return response.json(empresa)

    }
    async create(request: Request, response: Response){
        const schema = yup.object().shape({
            cnpj: yup.string()
            .min(14,"CNPJ INVÁLIDO, VERIFIQUE O CNPJ INFORMADO E TENTE NOVAMENTE")
            .max(14,"CNPJ INVÁLIDO, VERIFIQUE O CNPJ INFORMADO E TENTE NOVAMENTE")
            .required("POR FAVOR INFORME O NUMERO DO CNPJ"),
            matriz_filial: yup.string().required("INFORME O SE É MATRIZ OU FILIAL"),
            razao_social: yup.string().required("RAZÃO SOCIAL OBRIGATÓRIA"),
            nome_fantasia: yup.string(),
            situacao: yup.string().required("CAMPO SITUAÇÃO OBRIGATÓRIO"),
            data_situacao: yup.date().required("DATA DA SITUAÇÃO OBRIGATÓRIA") ,
            motivo_situacao:  yup.string(),
            nm_cidade_exterior: yup.string(),
            cod_pais: yup.number(),
            cod_nat_juridica: yup.number().required("INFORME O CODIGO DE NATUREZA JURIDICA"),
            data_inicio_ativ: yup.date().required("DATA DA INICIO ATIVIDADE OBRIGATÓRIA"),
            cnae_fiscal: yup.number().required("INFORME O CNAE PRINCIPAL"),
            tipo_logradouro: yup.string().required("INFORME O TIPO DE LOGRADOURO"),
            logradouro: yup.string().required("INFORME O LOGRADOURO"),
            numero:yup.string().required("INFORME O NUMERO DO ENDEREÇO"),
            complemento:yup.string(),
            bairro: yup.string().required("INFORME O BAIRRO"),
            cep: yup.string().required("INFORME O CEP"),
            uf: yup.string().required("INFORME O CEP"),
            cod_municipio: yup.string().required("INFORME O CODIGO DO MUNICIPIO"),
            municipio: yup.string().required("INFORME O NOME DO MUNICIPIO"),
            ddd_1: yup.string(),
            telefone_1: yup.string(),
            ddd_2: yup.string(),
            telefone_2: yup.string(),
            ddd_fax: yup.string(),
            num_fax: yup.string(),
            email: yup.string().email("INFORME UM E-MAIL VÁLIDO").required("INFORME O EMAIL"),
            qualif_resp: yup.string() ,
            capital_social: yup.string() ,
            porte: yup.string().required("INFORME O PORTE DA EMPRESA"),
            opc_simples: yup.string(),
            data_opc_simples: yup.date(),
            data_exc_simples: yup.date(),
            opc_mei: yup.string(),
            sit_especial: yup.string(),
            data_sit_especial: yup.date(),
                cnaes: yup.array(
                    yup.object().shape({
                        cnpj:yup.string(),
                        cnae_ordem: yup.number(),
                        cnae: yup.number().required("CNAE OBRIGATÓRIO"),
                        descricao_cnae: yup.string().required("DESCRIÇÃO OBRIGATÓRIA")
                    })
                    
                )

        })

        try {
            await schema.validate(request.body, { abortEarly: true })
        } catch (err) {
            throw new AppError(err.message,404)
        }


        const empresasRepository = getCustomRepository(EmpresasRepository);
        const empresa = empresasRepository.create(request.body)
        await empresasRepository.save(empresa);
        if(!empresa) {
            throw new AppError("Erro ao tentar salvar os dados!", 400)
        }
        return response.status(201).render("success");

    }

}

export { EmpresasController }