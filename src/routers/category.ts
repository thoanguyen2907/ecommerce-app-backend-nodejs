import { authorize, protect } from './../middlewares/auth'
import express from 'express'
import {
  createCategory,
  deleteCategory,
  findAll,
  updateCategory,
} from '../controllers/category'
import {
  findByCategoryId
} from '../controllers/product'
const router = express.Router()
authorize
// Every path we define here will get /api/v1/movies prefix
router.get('/', protect, authorize('user', 'admin'),  findAll)
router.get('/:categoryId', protect, authorize('user','admin'), findByCategoryId)
router.put('/:categoryId', protect, authorize('admin'), updateCategory)
router.delete('/:categoryId',protect, authorize('admin'), deleteCategory)
router.post('/',  protect, authorize('admin'), createCategory)

export default router
