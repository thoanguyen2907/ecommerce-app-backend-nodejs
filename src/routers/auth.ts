import { registerUser, loginUser, aboutMe, logout, forgotPasswordUser, resetPasswordUser, loginGoogle } from './../controllers/auth'
import express, { response } from 'express'
import {protect} from '../middlewares/auth'
import  validation from '../validates/Users'
import { Request, Response, NextFunction } from 'express'
import {OAuth2Client} from 'google-auth-library'
import { createLogger } from 'winston'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import AuthService from '../services/auth'
const router = express.Router()

const client = new OAuth2Client('627197289438-q9pagstkv3sk03pbssfisjqgrgidv7lo.apps.googleusercontent.com')

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
router.post('/forgotPassword', forgotPasswordUser)
router.post('/resetPassword/:resetToken', resetPasswordUser)
router.post('/google-login', loginGoogle)


export default router
