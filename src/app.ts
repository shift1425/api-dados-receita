import "reflect-metadata"
import express , { NextFunction, Request, Response } from 'express'
import "express-async-errors"
import createConnection from "./database"
import { router } from "./routers"
import { AppError } from "./errors/AppError"

createConnection();
const app = express();
const path = require('path');

app.use(express.json())

.use(express.urlencoded({ extended: true}))

app.use(router)
// utilizando os arquivos estáticos
.use(express.static('public'))

// configurar template engine
.set('views', path.join(__dirname, "views"))
.set('view engine', 'hbs')

app.use(
    (err:Error, request:Request, response:Response, _next: NextFunction) => {
        if(err instanceof AppError) {
            const message = {
                message: err.message,
                statuscode: err.statusCode,
            }

            return response.status(err.statusCode).render("error.hbs",{message})
        }
        
        const message = {
            message:`Internal server error ${err.message}`,
            statuscode:500,
        }
        return response.status(500).render("error.hbs",{message})
    }
)

export { app }