import express from 'express'
import lusca from 'lusca'
import dotenv from 'dotenv'

import rootRouter from './routers/index'
import apiErrorHandler from './middlewares/apiErrorHandler'

import compression from 'compression'
import cookieParser from 'cookie-parser'
import path from 'path'
import  cors from  'cors' 
dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.set('port', process.env.PORT || 5000)

// Use common 3rd-party middlewares
app.use(compression())
app.use(express.json())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use(cookieParser())
app.use(cors())

const publicPathDirectory = path.join(__dirname, './public')
app.use(express.static(publicPathDirectory) )
// Use movie router
app.use('/api/v1/', rootRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
