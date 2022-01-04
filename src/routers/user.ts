import express from 'express'
import { authorize, protect } from '../middlewares/auth'
import  validation from '../validates/Users'

import {
  createUser,
  findById,
  deleteUser,
  findAll,
  updateUser,
} from '../controllers/user'
const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
router.get('/', protect,  authorize('admin'), findAll)
router.get('/:userId', protect, findById)
router.put('/:userId', protect,  authorize('admin'), updateUser)
router.delete('/:userId', protect,  authorize('admin'), deleteUser)
router.post('/',  protect,  authorize('admin'), 
validation.checkEmail(),
validation.checkFirstName(),
validation.checkLastName(),
validation.checkPassword(),
validation.checkPhone(),
createUser
)

export default router
