import express from 'express'
import { project } from '../middlewares/auth'
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
const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
router.get('/', project, findAll)
router.get('/:orderId',project, findOrderById)

router.get('/user/:userId', project, findOrderByUserId)

router.put('/:orderId', project, updateOrder)
router.delete('/:orderId', project, deleteOrderById)

router.post('/', createOrder)
router.put('/event/increase/:orderId', project, increaseQuantity)
router.put('/event/decrease/:orderId',project, decreaseQuantity)
 

export default router
