import express from 'express'
import { authorize, protect } from '../middlewares/auth'
import {
  createOrder,
  findOrderById,
  deleteOrderById,
  findAll,
  updateOrder,
  increaseQuantity,
  decreaseQuantity,
  findOrderByUserId
} from '../controllers/order'
import  validation from '../validates/Order'
const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
router.get('/', protect, findAll)
router.get('/:orderId',protect,  authorize('admin'), findOrderById)

router.get('/user/:userId', protect,  authorize('user',  'admin'), findOrderByUserId)

router.put('/:orderId', protect,  authorize('admin'), updateOrder)
router.delete('/:orderId', protect,  authorize('user','admin'),  deleteOrderById)

router.post('/', 
validation.checkUserID(),
validation.checkProductId(),
validation.checkSizeOrder(),
validation.checkColorOrder(),
createOrder)

router.put('/event/increase/:orderId', protect,  authorize('user','admin'), increaseQuantity)
router.put('/event/decrease/:orderId',protect,  authorize('user','admin'), decreaseQuantity)
 

export default router
