import { Router } from 'express'
import { EmpresasController } from './controllers/EmpresasController'

const router = Router()

const empresasController = new EmpresasController()

router.get("/:cnpj", empresasController.show)

export { router }