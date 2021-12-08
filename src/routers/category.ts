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

// Every path we define here will get /api/v1/movies prefix
router.get('/',  findAll)
router.get('/:categoryId', findByCategoryId)
router.put('/:categoryId', updateCategory)
router.delete('/:categoryId',deleteCategory)
router.post('/',  createCategory)

export default router
