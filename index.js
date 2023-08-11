import dotenv from 'dotenv'
import express from 'express'
import alquilerRouter from './routers/alquilerRouter.js'
dotenv.config()

const app = express()

app.use(express.json())
app.use('/token', (req, res) => {
  res.send('Hola')
})
app.use('/api', alquilerRouter)
const config = JSON.parse(process.env.SERVER)

app.listen(config, () => {
  console.log(`http://${config.hostname}:${config.port}`)
})
