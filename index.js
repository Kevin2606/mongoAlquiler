import dotenv from 'dotenv'
import express from 'express'
import { crearToken, validarToken } from './middlewares/middlewareJWT.js'
import alquilerRouter from './routers/alquilerRouter.js'
dotenv.config()

const app = express()

app.get('/token', crearToken)
app.use('/', validarToken , alquilerRouter)

const config = JSON.parse(process.env.SERVER)
app.listen(config, () => {
  console.log(`http://${config.hostname}:${config.port}`)
})
