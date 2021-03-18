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

app.use(router)

.use(express.urlencoded({ extended: true }))
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
            }

            console.log(message)
            return response.status(err.statusCode).render("error.hbs",{message})
        }

        return response.status(500).json({
            status: "Error",
            message: `Internal server error ${err.message}`
        })
    }
)

export { app }