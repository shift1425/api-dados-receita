import { Router } from 'express'
import { EmpresasController } from './controllers/EmpresasController'
import { Controller } from './controllers/Controler'

const router = Router()

const empresasController = new EmpresasController()
const controller = new Controller()

router.get("/cnpj/:cnpj", empresasController.show)
router.get("/cnpj", controller.create)
router.get("/", (req, response) =>{
    return response.render("index")
} )

export { router }