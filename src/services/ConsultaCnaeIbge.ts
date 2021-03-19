import { json } from "express";

export default async function ConsultaCnaeIbge(cnae) {
  const request = require('request');
  await request(`https://servicodados.ibge.gov.br/api/v2/cnae/classes/43304`, function (error, response, body) {
  // console.error('error:', error); 
  // console.log('statusCode:', response && response.statusCode); 
  const cnae_desc = JSON.parse(body)
  //console.log(teste, "/n");
  //console.log(teste.descricao)
  return cnae_desc[0].descricao;
});
}
