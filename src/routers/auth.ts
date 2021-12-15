import { registerUser, loginUser, aboutMe, logout, forgotPasswordUser, resetPasswordUser } from './../controllers/auth'
import express from 'express'
import {protect} from '../middlewares/auth'
import  validation from '../validates/Users'
import { Request, Response, NextFunction } from 'express'

const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
router.post('/register',validation.checkEmail(),
validation.checkFirstName(),
validation.checkLastName(),
validation.checkPassword(),
validation.checkPhone(),
registerUser)

router.post('/login', loginUser)
router.get('/me', protect, aboutMe)
router.get('/logout', protect, logout)
router.post('/forgotPassword', protect, forgotPasswordUser)
router.post('/resetPassword/:resetToken', protect, resetPasswordUser)



export default router
