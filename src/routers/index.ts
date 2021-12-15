import express from 'express'
import productRouter from './product'
import userRouter from './user'
import authRouter from './auth'
import categoryRouter from './category'
import orderRouter from './order'
import paymentRouter from './stripe'
const rootRouter = express.Router()

rootRouter.use('/products', productRouter)
rootRouter.use('/users', userRouter)
rootRouter.use('/auth', authRouter)
rootRouter.use('/category', categoryRouter)
rootRouter.use('/orders', orderRouter)
rootRouter.use('/checkout', paymentRouter)

export default rootRouter
