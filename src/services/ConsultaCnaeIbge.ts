import axios from "axios";
export default async function ConsultaCnaeIbge(cnae) {

 const cnaes = await  axios
                            .get(`https://servicodados.ibge.gov.br/api/v2/cnae/classes/${cnae}`)
                            .then(response => (this.info = response))
  return cnaes.data.descricao
}
