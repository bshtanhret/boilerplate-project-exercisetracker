import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import { apiRouter } from './routes';
require('dotenv').config();

(async () => {
  const app = express()
  console.log('MongoDB connecting...')
  await mongoose.connect(process.env['MONGO_URL'] as string)
  console.log('MongoDB connected.')
  app.use((req, _, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`)
    next()
  })
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(express.static('public'))
  app.get('/', (_, res) => {
    res.sendFile(__dirname + '/views/index.html')
  });

  app.use('/api', apiRouter)

  const port = +(process.env['PORT'] || 3000)

  app.listen(port, () => {
    console.log('Your app is listening on port ' + port)
  })
})()
