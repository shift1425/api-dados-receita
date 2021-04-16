import { Router } from 'express'
import { EmpresasController } from './controllers/EmpresasController'

const router = Router()

const empresasController = new EmpresasController()

router.get("/cnpj/:cnpj", empresasController.show)
router.post("/cnpj", empresasController.create)
router.get("/", (req, response) =>{
    return response.render("index")
} )

export { router }